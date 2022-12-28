import { M } from 'msw/lib/glossary-dc3fd077';

import { loadFromStorage } from '../storage/storage';
import type { MswHandlers, ServerOrWorker } from '../types';
import {
  convertMockOptions,
  createStorageKey,
  createStorageMockOptions,
  initializeMockHandlers,
  resetMockHandlers,
  saveMockToStorage,
  updateStorageOptions,
  useMockHandlers,
} from './createMock.helpers';
import type { CreateMockOptions } from './createMock.types';
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

class CreateMockClass<T extends MockOptions> {
  private readonly _mockTitle: string;
  private _mockOptions: T;
  private readonly _openPageURL?: string;
  private readonly _createMockHandler: CreateMockHandlerFn<T>;
  private _initializedMockHandlers: MswHandlers[];
  private readonly _storageKey: string;
  private readonly _initialStorageOptions: StoredMockOptions<T>;
  private _storageOptions: StoredMockOptions<T>;
  private readonly _initialConvertedOptions: ConvertedMockOptions<T>;
  private _convertedOptions: ConvertedMockOptions<T>;
  private _serverOrWorker?: ServerOrWorker;

  constructor(
    options: CreateMockOptions<T>,
    createMockHandler: CreateMockHandlerFn<T>
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
    this._storageOptions = {
      ...this._initialStorageOptions,
      ...loadFromStorage<StoredMockState<T>>(this._storageKey)?.mockOptions,
    };
    this._initialConvertedOptions = convertMockOptions(this._storageOptions);
    this._convertedOptions = this._initialConvertedOptions;
    this._initializedMockHandlers = initializeMockHandlers(
      this._initialConvertedOptions,
      this._createMockHandler
    );
    saveMockToStorage<T>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._storageOptions,
    });
  }

  private _setServerOrWorker(serverOrWorker: ServerOrWorker) {
    this._serverOrWorker = serverOrWorker;
  }

  // TODO: breaking change resetMock renamed to reset
  /** resets mock with the mock options as defined in the createMock helpers first argument */
  public reset() {
    this._convertedOptions = this._initialConvertedOptions;
    this._storageOptions = this._initialStorageOptions;
    resetMockHandlers(this._serverOrWorker);
    saveMockToStorage<T>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._initialStorageOptions,
    });
  }
  // TODO: breaking change updateMock renamed to update
  /**
   * (partially) update mock options
   * @param partialMockOptions - (partial) mock options object to update in the shape of key value pairs.
   * @example 
   * ```js
  yourMock.update({ success: true });
   * ```
   */
  public update(partialMockOptions: Partial<ConvertedMockOptions<T>>) {
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
      this._createMockHandler
    );
    useMockHandlers(mockHandlers, this._serverOrWorker);
    saveMockToStorage<T>({
      storageKey: this._storageKey,
      mockTitle: this._mockTitle,
      openPageURL: this._openPageURL,
      mockOptions: this._storageOptions,
    });
  }
}

export type CreateMock = <T extends MockOptions>(
  options: CreateMockOptions<T>,
  fn: CreateMockHandlerFn<T>
) => CreateMockClass<T>;

export type CreateMockReturnType<T extends MockOptions = MockOptions> =
  CreateMockClass<T>;
