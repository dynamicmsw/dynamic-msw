import type { StateConfig } from '../storageState/storageState';
import { loadFromStorage } from '../storageState/storageState';
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
import { addMock, updateMock } from './mocksStorage';

export class CreateMock<T extends Options = Options> {
  public mockTitle: CreateMockArg<T>['mockTitle'];
  private mockOptions: CreateMockArg<T>['mockOptions'];
  private activeOptions: ConvertedStateOptions<StateOptions<OptionType>>;
  private openPageURL: CreateMockArg<T>['openPageURL'];
  public createMockHandler: CreateMockHandlerFn<T>;
  public mockHandlers: HandlerArray;
  private shouldSaveToStorage = true;

  constructor(
    options: CreateMockArg<T>,
    createMockHandler: CreateMockHandlerFn<T>
  ) {
    this.mockTitle = options.mockTitle;
    this.mockOptions = options.mockOptions;
    this.openPageURL = options.openPageURL;
    this.createMockHandler = createMockHandler;
  }
  private get stateFromStorage() {
    return loadFromStorage();
  }
  private get convertedMockOptionsToState() {
    return convertMockOptionsToState(this.mockOptions, this.activeOptions);
  }

  private get initialMocksState() {
    return this.stateFromStorage.mocks.find(
      ({ mockTitle }) => mockTitle === this.mockTitle
    );
  }

  private get initialActiveOptions() {
    return getActiveOptions(
      this.initialMocksState?.mockOptions || this.convertedMockOptionsToState
    );
  }

  public set PRIVATE_setConfig(config: StateConfig) {
    this.shouldSaveToStorage =
      typeof config?.saveToLocalStorage !== 'undefined'
        ? config?.saveToLocalStorage
        : true;
    this.initializeMock();
  }

  private initializeMock = () => {
    const existingMock = this.stateFromStorage.mocks.find(
      ({ mockTitle }) => mockTitle === this.mockTitle
    );
    this.activeOptions = this.initialActiveOptions;
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    if (this.shouldSaveToStorage) {
      addMock({
        ...existingMock,
        mockTitle: this.mockTitle,
        mockOptions: this.convertedMockOptionsToState,
        openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      });
    }
  };

  public updateMock = (updateObject: Partial<ConvertedOptions<T>>) => {
    this.activeOptions = { ...this.initialActiveOptions, ...updateObject };
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    global.__mock_worker?.use(...this.mockHandlers);
    if (this.shouldSaveToStorage) {
      updateMock({
        mockTitle: this.mockTitle,
        mockOptions: updateMockOptions(
          this.convertedMockOptionsToState,
          updateObject
        ),
        openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      });
    }
  };

  public resetMock = () => {
    this.activeOptions = getActiveOptions(
      convertMockOptionsToState(this.mockOptions, {})
    );
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler
    );
    global.__mock_worker?.use(...this.mockHandlers);
    if (this.shouldSaveToStorage) {
      updateMock({
        mockTitle: this.mockTitle,
        mockOptions: this.convertedMockOptionsToState,
        openPageURL: getPageURL(this.activeOptions, this.openPageURL),
      });
    }
  };
}

export const createMock = <T extends Options = Options>(
  options: CreateMockArg<T>,
  createMockHandler: CreateMockHandlerFn<T>
) => new CreateMock(options, createMockHandler);

export type CreateMockFn = typeof createMock;
