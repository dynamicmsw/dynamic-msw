import type { CreateMockReturnType } from '../createMock/createMock';

export type CreateScenarioMocks = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CreateMockReturnType<any, any>
>;

export type CreateScenarioParameter<T extends CreateScenarioMocks> = {
  title: string;
  mocks: T;
  options?: UpdateScenarioOptions<T>;
  data?: UpdateScenarioData<T>;
};

export type UpdateScenarioOptions<T extends CreateScenarioMocks> = {
  [K in keyof T]: Parameters<T[K]['updateOptions']>[0];
};
export type UpdateScenarioData<T extends CreateScenarioMocks> = {
  [K in keyof T]: Parameters<T[K]['updateData']>[0];
};

export type ScenarioCreateMocks<T extends CreateScenarioMocks> = Record<
  keyof T,
  CreateMockReturnType
>;
