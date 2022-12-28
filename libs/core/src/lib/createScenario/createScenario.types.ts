import type { CreateMockReturnType } from '../createMock/createMock';
import type { ConvertedMockOptionsBase } from '../createMock/createMock.types';

export type CreateScenarioMocks = Record<
  string,
  {
    mock: CreateMockReturnType;
    initialMockOptions: ConvertedMockOptionsBase;
    mockOptions: ConvertedMockOptionsBase;
  }
>;

export type CreateScenarioMocksGeneric =
  | Record<string, ConvertedMockOptionsBase>
  | undefined;

export type UpdateCreateScenarioMocksGeneric<
  TUpdate extends CreateScenarioMocksGeneric,
  TMockOptions extends ConvertedMockOptionsBase,
  TMockTitle extends string
> = TUpdate extends undefined
  ? {
      [key in TMockTitle]: TMockOptions;
    }
  : TUpdate & {
      [key in TMockTitle]: TMockOptions;
    };
