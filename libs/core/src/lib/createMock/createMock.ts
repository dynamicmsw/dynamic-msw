import { loadFromStorage } from '../storage/storage';
import type { MswHandlers, ServerOrWorker } from '../types';
import {
  convertMockOptions,
  createStorageKey,
  createStorageMockOptions,
  initializeMockHandlers,
  saveMockToStorage,
  updateStorageOptions,
  useMockHandlers,
} from './createMock.helpers';
import type { MockData, CreateMockOptions } from './createMock.types';
import type {
  ConvertedMockOptions,
  CreateMockHandlerFn,
  MockOptions,
  StoredMockOptions,
  StoredMockState,
} from './createMock.types';

/**
 * An function which allows for creating mocks which can be dynamically
 * updated. It can be used in combination with `@dynamic-msw/dashboard`. The
 * dashboard is used to view dynamic mocks in the browser and alter the
 * mock options on the fly. It also adds the ability to configure an page URL
 * in which you can see the specific mock in action
 * @param options - mock options and dashboard metadata
 * @param handlerFn - an function in which the argument contains an object with mock option keys and their associated active value. It should return an MSW rest/graphl handler or array of handlers
 * @returns an object containing helpers to update or reset mock options
 * @example
 * ```js
 import { rest } from 'msw';
 import { createMock } from '@dynamic-msw/core';
 
 export const loginMock = createMock(
   {
     _mockTitle: 'login',
     mockOptions: {
       success: true,
     },
   },
   (options) => {
     return rest.post('/login', async (req, res, ctx) => {
       const { username } = await req.json();
 
       return options.success
         ? res(
             ctx.json({
               firstName: 'John',
             })
           )
         : res(
             ctx.status(403),
             ctx.json({
               errorMessage: `User '${username}' not found`,
             })
           );
     });
   }
 );

 loginMock.updateMock({ success: false });
 loginMock.resetMock();
 * ```
 */
export const createMock: CreateMock = (options, handlerFn) =>
  new CreateMockClass(options, handlerFn);

// TODO: breaking change altered private values
class CreateMockClass<TOptions extends MockOptions, TData extends MockData> {
  private readonly _mockTitle: string;
  private _mockOptions: TOptions;
  private _initialMockData: TData;
  private _data: TData;
  private readonly _openPageURL?: string;
  private readonly _createMockHandler: CreateMockHandlerFn<TOptions, TData>;
  private _initializedMockHandlers: MswHandlers[];
  private readonly _storageKey: string;
  private readonly _initialStorageOptions: StoredMockOptions<TOptions>;
  private _storageOptions: StoredMockOptions<TOptions>;
  private readonly _initialConvertedOptions: ConvertedMockOptions<TOptions>;
  private _convertedOptions: ConvertedMockOptions<TOptions>;
  private _serverOrWorker?: ServerOrWorker;

  constructor(
    options: CreateMockOptions<TOptions, TData>,
    createMockHandler: CreateMockHandlerFn<TOptions, TData>
  ) {
    this._mockTitle = options.mockTitle;
    this._mockOptions = options.mockOptions;
    this._openPageURL =
      typeof options.openPageURL === 'function'
        ? options.openPageURL.toString()
        : options.openPageURL;
    this._createMockHandler = createMockHandler;
    this._storageKey = createStorageKey(this._mockTitle);
    this._initialStorageOptions = createStorageMockOptions(this._mockOptions);
    const storageData = loadFromStorage<StoredMockState<TOptions, TData>>(
      this._storageKey
    );
    this._storageOptions = {
      ...this._initialStorageOptions,
      ...storageData?.mockOptions,
    };
    // TODO: check if we can remove this type cast
    this._initialMockData = options.data as TData;
    this._data = this._initialMockData
      ? { ...this._initialMockData, ...storageData?.data }
      : this._initialMockData;
    this._initialConvertedOptions = convertMockOptions(this._storageOptions);
    this._convertedOptions = this._initialConvertedOptions;
    this._initializedMockHandlers = initializeMockHandlers<TOptions, TData>(
      this._initialConvertedOptions,
      this._createMockHandler,
      {
        updateOptions: this.updateOptions,
        updateData: this.updateData,
        data: this._data,
      }
    );
    saveMockToStorage<TOptions, TData>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._storageOptions,
      data: this._data,
    });
  }
  // TODO: breaking change added requirement to set server or worker when using getDynamicMocks
  private _setServerOrWorker(serverOrWorker: ServerOrWorker) {
    this._serverOrWorker = serverOrWorker;
  }

  // TODO: breaking change resetMock renamed to reset
  /** resets mock with the mock options as defined in the createMock helpers first argument */
  public reset() {
    this._convertedOptions = this._initialConvertedOptions;
    this._storageOptions = this._initialStorageOptions;
    this._data = this._initialMockData;
    useMockHandlers(this._initializedMockHandlers, this._serverOrWorker);
    saveMockToStorage<TOptions, TData>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._initialStorageOptions,
      data: this._initialMockData,
    });
  }
  // TODO: breaking change updateMock renamed to updateOptions
  /**
   * (partially) update mock options
   * @param partialMockOptions - (partial) mock options object to update in the shape of key value pairs.
   * @example
   * ```js
   * yourMock.update({ success: true });
   * ```
   */
  public updateOptions = (
    partialMockOptions: Partial<ConvertedMockOptions<TOptions>>
  ) => {
    const updatedStorageOptions = updateStorageOptions(
      partialMockOptions,
      this._storageOptions
    );
    this._storageOptions = {
      ...this._storageOptions,
      ...updatedStorageOptions,
    };
    this._convertedOptions = {
      ...this._convertedOptions,
      ...convertMockOptions(updatedStorageOptions),
    };
    const mockHandlers = initializeMockHandlers(
      this._convertedOptions,
      this._createMockHandler,
      {
        updateOptions: this.updateOptions,
        updateData: this.updateData,
        data: this._data,
      }
    );
    useMockHandlers(mockHandlers, this._serverOrWorker);
    saveMockToStorage<TOptions, TData>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._storageOptions,
      data: this._data,
    });
  };

  public updateData = (update: ((data: TData) => TData) | TData): void => {
    // const updatedData =
    //   typeof update === 'function' ? update(this._data) : update;
    const updatedData =
      typeof update === 'function' ? update(this._data) : update;
    const mockHandlers = initializeMockHandlers(
      this._convertedOptions,
      this._createMockHandler,
      {
        updateOptions: this.updateOptions,
        updateData: this.updateData,
        data: updatedData,
      }
    );
    useMockHandlers(mockHandlers, this._serverOrWorker);
  };
}

export type CreateMock = <
  TOptions extends MockOptions,
  TData extends MockData = MockData
>(
  options: CreateMockOptions<TOptions, TData>,
  fn: CreateMockHandlerFn<TOptions, TData>
) => CreateMockReturnType<TOptions, TData>;

export type CreateMockReturnType<
  TOptions extends MockOptions = MockOptions,
  TData extends MockData = MockData
> = {
  updateOptions: CreateMockClass<TOptions, TData>['updateOptions'];
  reset: CreateMockClass<TOptions, TData>['reset'];
  updateData: CreateMockClass<TOptions, TData>['updateData'];
};

export type CreateMockPrivateReturnType<
  TOptions extends MockOptions = MockOptions,
  TData extends MockData = MockData
> = {
  _setServerOrWorker: CreateMockClass<TOptions, TData>['_setServerOrWorker'];
  _initialConvertedOptions: CreateMockClass<
    TOptions,
    TData
  >['_initialConvertedOptions'];
  _initialMockData: CreateMockClass<TOptions, TData>['_initialMockData'];
  _createMockHandler: CreateMockClass<TOptions, TData>['_createMockHandler'];
};
