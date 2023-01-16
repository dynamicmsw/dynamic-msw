import type { CreateMockPrivateReturnType } from '../createMock/createMock';
import { createStorageKey } from '../createMock/createMock.helpers';
import { loadFromStorage, saveToStorage } from '../storage/storage';
import type { Config, MswHandlers, ServerOrWorker } from '../types';
import {
  createScenarioKey,
  createScenarioMocks,
} from './createScenario.helpers';
import type {
  CreateScenarioParameter,
  CreateScenarioMocks,
  UpdateScenarioOptions,
  UpdateScenarioData,
  ScenarioCreateMocks,
  StoredScenarioState,
} from './createScenario.types';

export const createScenario: CreateScenario = (mocks) =>
  new CreateScenarioClass(mocks);

class CreateScenarioClass<T extends CreateScenarioMocks> {
  private _scenarioMocks: ScenarioCreateMocks<T>;
  private _initializedMockHandlers: MswHandlers[];
  private _openPageURL?: string;
  private _isActive: boolean;
  constructor(o: CreateScenarioParameter<T>) {
    this._openPageURL = o.openPageURL;
    this._scenarioMocks = createScenarioMocks(
      o.mocks,
      o.title,
      o.options,
      o.data
    );
    const storageKey = createStorageKey(createScenarioKey(o.title));
    this._initializedMockHandlers = Object.keys(this._scenarioMocks).flatMap(
      (key) =>
        (this._scenarioMocks[key] as CreateMockPrivateReturnType<any, any>)
          ._initializedMockHandlers
    );
    const storageData = loadFromStorage<StoredScenarioState>(storageKey);
    this._isActive = !!storageData.isActive;
    saveToStorage<StoredScenarioState>(storageKey, {
      isActive: this._isActive,
      openPageURL: this._openPageURL,
    });
  }

  // TODO: breaking change added requirement to set server or worker when using getDynamicMocks
  private _setServerOrWorker(serverOrWorker: ServerOrWorker) {
    Object.keys(this._scenarioMocks).forEach((key) => {
      (
        this._scenarioMocks[key] as unknown as CreateMockPrivateReturnType
      )._setServerOrWorker(serverOrWorker);
    });
  }
  private _setConfig(config: Partial<Config>) {
    Object.keys(this._scenarioMocks).forEach((key) => {
      (
        this._scenarioMocks[key] as unknown as CreateMockPrivateReturnType
      )._setConfig(config);
    });
  }

  // TODO: add comment and tests
  public activate() {
    this._isActive = true;
    Object.keys(this._scenarioMocks).forEach((key) => {
      this._scenarioMocks[key].activate();
    });
  }
  // TODO: add comment and tests
  public deactivate() {
    Object.keys(this._scenarioMocks).forEach((key) => {
      this._scenarioMocks[key].deactivate();
    });
  }
  public updateOptions(options: Partial<UpdateScenarioOptions<T>>) {
    Object.keys(options).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._scenarioMocks[key].updateOptions(options[key]!);
    });
  }
  public updateData(data: Partial<UpdateScenarioData<T>>) {
    Object.keys(data).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._scenarioMocks[key].updateData(data[key]!);
    });
  }
  public reset() {
    Object.keys(this._scenarioMocks).forEach((key) => {
      this._scenarioMocks[key].reset();
    });
  }
}

export type CreateScenario = <T extends CreateScenarioMocks>(
  options: CreateScenarioParameter<T>
) => CreateScenarioReturnType<T>;

export type CreateScenarioReturnType<T extends CreateScenarioMocks> = {
  activate: CreateScenarioClass<T>['activate'];
  deactivate: CreateScenarioClass<T>['deactivate'];
  updateOptions: CreateScenarioClass<T>['updateOptions'];
  updateData: CreateScenarioClass<T>['updateData'];
  reset: CreateScenarioClass<T>['reset'];
};

export type CreateScenarioPrivateReturnType<T extends CreateScenarioMocks> =
  CreateScenarioReturnType<T> & {
    _setServerOrWorker: CreateScenarioClass<T>['_setServerOrWorker'];
    _setConfig: CreateScenarioClass<T>['_setConfig'];
    _initializedMockHandlers: CreateScenarioClass<T>['_initializedMockHandlers'];
    _isActive: boolean;
  };
