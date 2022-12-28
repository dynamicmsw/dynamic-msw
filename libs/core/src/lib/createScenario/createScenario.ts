import type { CreateMockReturnType } from '../createMock/createMock';
import type { MockData, MockOptions } from '../createMock/createMock.types';
import { createMockState } from './createScenario.helpers';
import type {
  CreateScenarioMocks,
  CreateScenarioMocksGeneric,
  UpdateCreateScenarioMocksGeneric,
} from './createScenario.types';

// TODO: breaking change initialization
export const createScenario: CreateScenario = (title) =>
  new CreateScenarioClass(title);

class CreateScenarioClass<T extends CreateScenarioMocksGeneric = undefined> {
  private _title: string;
  private _mocks?: CreateScenarioMocks;

  constructor(title: string, mocks?: CreateScenarioMocks) {
    this._title = title;
    this._mocks = mocks;
  }

  // TODO: breaking change of adding mocks
  public addMock<
    TMockKey extends string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TMock extends CreateMockReturnType<MockOptions, any>
  >(
    key: TMockKey,
    mock: TMock,
    mockOptions: Parameters<TMock['updateOptions']>[0],
    mockData?: Parameters<TMock['updateData']>[0]
  ) {
    const data = {
      ...this._mocks,
      ...createMockState(key, mock, mockOptions, mockData),
    };
    return new CreateScenarioClass<
      UpdateCreateScenarioMocksGeneric<
        T,
        Parameters<TMock['updateOptions']>[0],
        TMockKey
      >
    >(this._title, data);
  }

  public updateOptions(x: Partial<T>) {
    //
  }
  public reset() {
    //
  }
}

export type CreateScenario = (title: string) => CreateScenarioReturnType;
export type CreateScenarioReturnType = CreateScenarioClass;
