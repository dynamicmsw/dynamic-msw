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
  MockData,
} from './createMock.types';
import { addMock, updateMock } from './mocksStorage';

export class CreateMock<
  O extends Options = Options,
  D extends MockData = MockData
> {
  public mockTitle: CreateMockArg<O, D>['mockTitle'];
  public mockOptions: CreateMockArg<O, D>['mockOptions'];
  public mockData: CreateMockArg<O, D>['mockData'];
  private activeMockData: CreateMockArg<O, D>['mockData'];
  private activeOptions: ConvertedStateOptions<StateOptions<OptionType>>;
  private openPageURL: CreateMockArg<O, D>['openPageURL'];
  public createMockHandler: CreateMockHandlerFn<O, D>;
  public mockHandlers: HandlerArray;
  private shouldSaveToStorage = true;

  constructor(
    options: CreateMockArg<O, D>,
    createMockHandler: CreateMockHandlerFn<O, D>
  ) {
    this.mockTitle = options.mockTitle;
    this.mockOptions = options.mockOptions;
    this.openPageURL = options.openPageURL;
    this.mockData = options.mockData;
    this.activeMockData = options.mockData;
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
      this.createMockHandler,
      { updateMockData: this.updateMockData },
      this.activeMockData
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

  public updateMockOptions = (updateObject: Partial<ConvertedOptions<O>>) => {
    this.activeOptions = { ...this.initialActiveOptions, ...updateObject };
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler,
      { updateMockData: this.updateMockData },
      this.activeMockData
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

  public updateMock = this.updateMockOptions;

  public updateMockData = (updateData: Partial<D>) => {
    this.activeMockData = { ...this.activeMockData, ...updateData };
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler,
      { updateMockData: this.updateMockData },
      this.activeMockData
    );
    global.__mock_worker?.use(...this.mockHandlers);
  };

  public resetMock = () => {
    this.activeOptions = getActiveOptions(
      convertMockOptionsToState(this.mockOptions, {})
    );
    this.activeMockData = this.mockData;
    this.mockHandlers = initializeMocks(
      this.activeOptions,
      this.createMockHandler,
      { updateMockData: this.updateMockData },
      this.activeMockData
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

export const createMock = <
  O extends Options = Options,
  D extends MockData = MockData
>(
  options: CreateMockArg<O, D>,
  createMockHandler: CreateMockHandlerFn<O, D>
) => new CreateMock(options, createMockHandler);

export type CreateMockFn = typeof createMock;
