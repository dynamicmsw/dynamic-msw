import { state } from '../state/state';
import {
  getActiveOptions,
  initializeMocks,
  updateMockOptions,
  getPageURL,
  convertMockOptionsToState,
} from './createMock.helpers';
import type {
  ConvertedOptions,
  Options,
  StateOptions,
  CreateMockArg,
  HandlerArray,
  CreateMockHandlerFn,
  OptionType,
  ConvertedStateOptions,
} from './createMock.types';

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

export const createMock = <T extends Options = Options>(
  options: CreateMockArg<T>,
  createMockHandler: CreateMockHandlerFn<T>
) => new CreateMock(options, createMockHandler);

export type CreateMockFn = typeof createMock;
