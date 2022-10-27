import type { CreateMock } from '../createMock/createMock';
import type {
  ConvertedOptions,
  CreateMockHandlerFn,
  HandlerArray,
} from '../createMock/createMock.types';

export interface CreateMockOptions {
  mockOptions: ConvertedOptions;
  mockTitle: string;
}

export type ScenarioMock<T extends CreateMock[]> = {
  [K in keyof T]: {
    mock: T[K];
    mockOptions: Parameters<T[K]['updateMock']>[0];
  };
};

export type Mocks = Record<string, CreateMock>;

export type SetupMocksFn = (
  options: CreateMockOptions,
  createMockHandler: CreateMockHandlerFn
) => HandlerArray;

export type OpenPageFn<T> = (mockConfig: T) => string;

export type OpenPageURL<T extends Mocks> =
  | string
  | OpenPageFn<{ [K in keyof T]: Parameters<T[K]['updateMock']>[0] }>
  | null;

export type OptionsArg<T extends Mocks> =
  | {
      scenarioTitle: string;
      openPageURL?: OpenPageURL<T>;
    }
  | string;

export type MockOptionsArg<T extends Mocks> = {
  [K in keyof T]: Parameters<T[K]['updateMock']>[0];
};
