import type { CreateMockReturnType } from '../createMock/createMock';
import type { DeepPartial } from '../types';

export type CreateScenarioMocks = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CreateMockReturnType<any, any>
>;

export type CreateScenarioParameter<T extends CreateScenarioMocks> = {
  title: string;
  mocks: T;
  // TODO: make dynamic
  openPageURL?: string;
  options?: UpdateScenarioOptions<T>;
  data?: UpdateScenarioData<T>;
};

export type UpdateScenarioOptions<T extends CreateScenarioMocks> = {
  [K in keyof T]?: Parameters<T[K]['updateOptions']>[0];
};
export type UpdateScenarioData<T extends CreateScenarioMocks> = {
  [K in keyof T]: DeepPartial<T[K]['data']>;
};

export type ScenarioCreateMocks<T extends CreateScenarioMocks> = Record<
  keyof T,
  CreateMockReturnType
>;

export type StoredScenarioState = {
  openPageURL?: string;
  isActive?: boolean;
};
