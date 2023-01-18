import type { RequestHandler } from 'msw';

import { loadFromStorage, saveToStorage } from '../storage/storage';
import type { SetupServerOrWorkerApi, Config, DeepPartial } from '../types';
import {
  convertMockOptions,
  createDataStorageKey,
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
     title: 'login',
     options: {
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
  private readonly _title: string;
  private _options: TOptions;
  private readonly _initialMockData: TData;
  private _data: TData;
  private readonly _openPageURL?: string;
  private readonly _updateDataTransformer?: CreateMockOptions<
    TOptions,
    TData
  >['updateDataTransformer'];
  private readonly _createMockHandler: CreateMockHandlerFn<TOptions, TData>;
  private _initializedMockHandlers: RequestHandler[];
  private readonly _storageKey: string;
  private readonly _storageDataKey: string;
  private readonly _initialStorageOptions: StoredMockOptions<TOptions>;
  private _storageOptions: StoredMockOptions<TOptions>;
  private readonly _initialConvertedOptions: ConvertedMockOptions<TOptions>;
  private _convertedOptions: ConvertedMockOptions<TOptions>;
  private _serverOrWorker?: SetupServerOrWorkerApi;
  private _isActive = false;
  private _config: Config = { saveToStorage: false };

  constructor(
    o: CreateMockOptions<TOptions, TData>,
    createMockHandler: CreateMockHandlerFn<TOptions, TData>
  ) {
    // TODO: breaking change mockTitle renamed to title
    // TODO: breaking change mockOptions renamed to options
    this._title = o.title;
    this._options = o.options;
    this._openPageURL =
      typeof o.openPageURL === 'function'
        ? o.openPageURL.toString()
        : o.openPageURL;
    this._updateDataTransformer = o.updateDataTransformer;
    this._createMockHandler = createMockHandler;
    this._storageKey = createStorageKey(this._title);
    this._storageDataKey = createDataStorageKey(this._title);
    this._initialStorageOptions = createStorageMockOptions(this._options);
    const storageConfig = loadFromStorage<StoredMockState<TOptions>>(
      this._storageKey
    );
    const storageData = loadFromStorage<TData>(this._storageDataKey);
    this._isActive = !!storageConfig.isActive;
    this._storageOptions = {
      ...this._initialStorageOptions,
      ...storageConfig?.options,
    };
    // TODO: check if we can remove this type cast
    this._initialMockData = o.data as TData;
    this._data = this._initialMockData
      ? { ...this._initialMockData, ...storageData }
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
  }

  // TODO: breaking change added requirement to set server or worker when using getDynamicMocks
  private _setServerOrWorker = (serverOrWorker: SetupServerOrWorkerApi) => {
    this._serverOrWorker = serverOrWorker;
  };
  private _setConfig = (config: Partial<Config>) => {
    this._config = { ...this._config, ...config };
    saveMockToStorage<TOptions>({
      storageKey: this._storageKey,
      title: this._title,
      openPageURL: this._openPageURL,
      options: this._storageOptions,
      isActive: this._isActive,
      config: this._config,
    });
    if (this._config.saveToStorage && this._initialMockData) {
      saveToStorage<TData>(this._storageDataKey, this._initialMockData);
    }
  };
  // TODO: add comment and tests
  public activate = () => {
    this._isActive = true;
    useMockHandlers(
      this._initializedMockHandlers,
      this._serverOrWorker,
      this._isActive,
      this._config
    );
  };
  // TODO: add comment and tests
  public deactivate = () => {
    this._isActive = false;
    this._serverOrWorker?.resetHandlers();
  };
  // TODO: breaking change resetMock renamed to reset
  /** resets mock with the mock options as defined in the createMock helpers first argument */
  public reset = () => {
    this._convertedOptions = this._initialConvertedOptions;
    this._storageOptions = this._initialStorageOptions;
    this._data = this._initialMockData;
    useMockHandlers(
      this._initializedMockHandlers,
      this._serverOrWorker,
      this._isActive,
      this._config
    );
    saveMockToStorage<TOptions>({
      storageKey: this._storageKey,
      title: this._title,
      openPageURL: this._openPageURL,
      options: this._initialStorageOptions,
      isActive: this._isActive,
      config: this._config,
    });
    if (this._config.saveToStorage) {
      saveToStorage<TData>(this._storageDataKey, this._initialMockData);
    }
  };
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
    useMockHandlers(
      mockHandlers,
      this._serverOrWorker,
      this._isActive,
      this._config
    );
    saveMockToStorage<TOptions>({
      storageKey: this._storageKey,
      title: this._title,
      openPageURL: this._openPageURL,
      options: this._storageOptions,
      isActive: this._isActive,
      config: this._config,
    });
  };

  public updateData = <
    ReturnData extends DeepPartial<TData> = DeepPartial<TData>
  >(
    update: ((data: TData) => ReturnData) | ReturnData
  ): void => {
    const updatedData =
      typeof update === 'function' ? update(this._data) : update;
    const transformedData =
      this._updateDataTransformer?.(updatedData, this._data) || updatedData;
    const mockHandlers = initializeMockHandlers(
      this._convertedOptions,
      this._createMockHandler,
      {
        updateOptions: this.updateOptions,
        updateData: this.updateData,
        data: transformedData as TData,
      }
    );
    useMockHandlers(
      mockHandlers,
      this._serverOrWorker,
      this._isActive,
      this._config
    );
    // TODO: consider if we want to save data to storage
    if (this._config.saveToStorage) {
      saveToStorage(this._storageDataKey, { ...this._data, ...updatedData });
    }
  };
}

export type CreateMock = <
  TOptions extends MockOptions,
  TData extends MockData = MockData
>(
  createMockOptions: CreateMockOptions<TOptions, TData>,
  fn: CreateMockHandlerFn<TOptions, TData>
) => CreateMockReturnType<TOptions, TData>;

export type CreateMockReturnType<
  TOptions extends MockOptions = MockOptions,
  TData extends MockData = MockData
> = {
  updateOptions: CreateMockClass<TOptions, TData>['updateOptions'];
  reset: CreateMockClass<TOptions, TData>['reset'];
  updateData: CreateMockClass<TOptions, TData>['updateData'];
  activate: CreateMockClass<TOptions, TData>['activate'];
  deactivate: CreateMockClass<TOptions, TData>['deactivate'];
};

export type CreateMockPrivateReturnType<
  TOptions extends MockOptions = MockOptions,
  TData extends MockData = MockData
> = CreateMockReturnType<TOptions, TData> & {
  _title: string;
  _openPageURL: string;
  _setConfig: CreateMockClass<TOptions, TData>['_setConfig'];
  _setServerOrWorker: CreateMockClass<TOptions, TData>['_setServerOrWorker'];
  _initialConvertedOptions: CreateMockClass<
    TOptions,
    TData
  >['_initialConvertedOptions'];
  _initialMockData: CreateMockClass<TOptions, TData>['_initialMockData'];
  _createMockHandler: CreateMockClass<TOptions, TData>['_createMockHandler'];
  _initialStorageOptions: CreateMockClass<
    TOptions,
    TData
  >['_initialStorageOptions'];
  _initializedMockHandlers: CreateMockClass<
    TOptions,
    TData
  >['_initializedMockHandlers'];
  _isActive: boolean;
};
