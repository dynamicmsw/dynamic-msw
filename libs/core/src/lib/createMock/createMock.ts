import { state } from '../state/state';
import type {
  SetupMocksFn,
  ConvertMockOptionsFn,
  ConvertedOptions,
  Options,
  StateOptions,
  OpenPageFn,
  HandlerArray,
  CreateMockHandlerFn,
  OptionType,
  ConvertedStateOptions,
} from './createMock.types';

export const getActiveOptions: ConvertMockOptionsFn = (options) =>
  Object.keys(options).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]:
        typeof options[curr].selectedValue !== 'undefined'
          ? options[curr].selectedValue
          : options[curr].defaultValue,
    }),
    {} as ConvertedStateOptions
  );

export const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

const updateMockOptions = (
  options: StateOptions,
  updateObject: ConvertedOptions
): StateOptions =>
  Object.keys(options).reduce(
    (prev, optionKey) => ({
      ...prev,
      [optionKey]: {
        ...options[optionKey],
        // TODO: perhaps this type cast can be removed
        selectedValue: updateObject[optionKey] as OptionType,
      },
    }),
    options
  );

const getPageURL = (
  config: ConvertedOptions,
  openPageURL: string | OpenPageFn
) => (typeof openPageURL === 'function' ? openPageURL(config) : openPageURL);

const convertMockOptionsToState = (options: Options): StateOptions =>
  (Object.keys(options) as Array<keyof Options>).reduce((prev, optionKey) => {
    const option = options[optionKey];
    return {
      ...prev,
      [optionKey]: {
        ...(typeof option === 'object' ? option : {}),
        defaultValue: typeof option === 'object' ? option.defaultValue : option,
      },
    };
  }, {});

export class CreateMock<T extends Options = Options> {
  public mockTitle: CreateMockArg<T>['mockTitle'];
  private mockOptions: CreateMockArg<T>['mockOptions'];
  private activeOptions: ConvertedStateOptions<StateOptions<OptionType>>;
  private openPageURL: CreateMockArg<T>['openPageURL'];
  private createMockHandler: CreateMockHandlerFn<T>;
  private mockHandlers: HandlerArray;

  constructor(
    options: CreateMockArg<T>,
    createMockHandler: CreateMockHandlerFn<T>
  ) {
    this.mockTitle = options.mockTitle;
    this.mockOptions = options.mockOptions;
    this.openPageURL = options.openPageURL;
    this.createMockHandler = createMockHandler;
    this.initializeMock();
  }

  private get convertedMockOptionsToState() {
    return convertMockOptionsToState(this.mockOptions);
  }

  private get initialMockState() {
    return state.currentState.mocks.find(
      ({ mockTitle }) => mockTitle === this.mockTitle
    );
  }

  private get initialActiveOptions() {
    return getActiveOptions(
      this.initialMockState?.mockOptions || this.convertedMockOptionsToState
    );
  }

  private initializeMock = () => {
    if (this.initialMockState?.resetMock) {
      throw Error(
        `Looks like you initialized 2 createMock functions with the same mock title: '${this.initialMockState.mockTitle}'. This Please ensure the mockTitle option is unique across your mocks.`
      );
    }
    this.activeOptions = this.initialActiveOptions;
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    state.addMock({
      mockTitle: this.mockTitle,
      mockOptions: this.convertedMockOptionsToState,
      openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      updateMock: this.updateMock,
      resetMock: this.resetMock,
      mockHandlers: this.mockHandlers,
      createMockHandler: this.createMockHandler,
    });
  };

  public updateMock = (updateObject: Partial<ConvertedOptions<T>>) => {
    this.activeOptions = { ...this.initialActiveOptions, ...updateObject };
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    global.__mock_worker?.use(...this.mockHandlers);

    state.updateMock({
      mockTitle: this.mockTitle,
      mockOptions: updateMockOptions(
        this.convertedMockOptionsToState,
        updateObject
      ),
      openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      updateMock: this.updateMock,
      resetMock: this.resetMock,
      mockHandlers: this.mockHandlers,
      createMockHandler: this.createMockHandler,
    });
  };

  public resetMock = () => {
    this.activeOptions = getActiveOptions(this.convertedMockOptionsToState);
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    global.__mock_worker?.use(...this.mockHandlers);
    state.updateMock({
      mockTitle: this.mockTitle,
      mockOptions: this.convertedMockOptionsToState,
      openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      updateMock: this.updateMock,
      resetMock: this.resetMock,
      mockHandlers: this.mockHandlers,
      createMockHandler: this.createMockHandler,
    });
  };
}

interface CreateMockArg<T extends Options> {
  mockTitle: string;
  openPageURL?: string | OpenPageFn<ConvertedOptions<T>>;
  mockOptions?: T;
}

export const createMock = <T extends Options = Options>(
  options: CreateMockArg<T>,
  createMockHandler: CreateMockHandlerFn<T>
) => new CreateMock(options, createMockHandler);

export type CreateMockFn = typeof createMock;
