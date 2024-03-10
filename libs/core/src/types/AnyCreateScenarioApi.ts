import { type CreateScenarioPublicApi } from '../configureScenario/CreateScenarioApi';
import type CreateScenarioApi from '../configureScenario/CreateScenarioApi';
import { type AnyCreateMockApi } from './AnyCreateMockApi';
import { type AnyCreateMockPublicApi } from './AnyCreateMockApi';

export type AnyCreateScenarioPublicApi = CreateScenarioPublicApi<
  AnyCreateMockPublicApi[]
>;

export type AnyCreateScenarioApi = CreateScenarioApi<AnyCreateMockApi[]>;
