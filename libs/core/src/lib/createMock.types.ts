import type { RestHandler } from 'msw';

type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

type ConfigType = boolean | string | number;

export type Config<T extends ConfigType = ConfigType> = Record<
  string,
  {
    options: T[];
    defaultValue: T;
  }
>;

export interface CreateMockConfigArg<C extends Config = Config> {
  id: string;
  openPage?: string;
  config?: C;
}

export type ConvertedConfig<C extends Config = Config> = {
  [Key in keyof C]: ArrayElementType<C[Key]['options']>;
};

export type CreateMockMockFn<C extends Config = Config> = (
  config: ConvertedConfig<C>
) => RestHandler | RestHandler[];

export type OpenPageFn<C extends Config = Config> = (
  config: ConvertedConfig<C>
) => string;

export type ConvertConfigOptionsFn = (
  config: Config
) => ConvertedConfig<Config>;

export type SetupMocksFn = (
  options: ConvertedConfig<Config>,
  mockFn: CreateMockMockFn
) => RestHandler[];

export interface CreateMockFnReturnType<C extends Config = Config> {
  id: string;
  mocks: RestHandler[];
  pageUrl: string;
  updateMock: (updateValues: Partial<ConvertedConfig<C>>) => void;
  resetMock: () => void;
}

export interface CreateMockFnStateValue {
  resetMock: () => void;
  updateMock: (updateValues: Partial<ConvertedConfig>) => void;
  pageUrl?: string;
  config: Config;
  convertedConfig: ConvertedConfig<Config<ConfigType>>;
}

export type CreateMockFnState = Record<string, CreateMockFnStateValue>;
