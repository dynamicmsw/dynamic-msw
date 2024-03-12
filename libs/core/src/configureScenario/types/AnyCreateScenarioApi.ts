import { type CreateScenarioPublicApi } from '../CreateScenarioApi';
import type CreateScenarioApi from '../CreateScenarioApi';
import { type AnyCreateMockApi } from '../../configureMock/types/AnyCreateMockApi';
import { type AnyCreateMockPublicApi } from '../../configureMock/types/AnyCreateMockApi';

export type AnyCreateScenarioPublicApi = CreateScenarioPublicApi<
  AnyCreateMockPublicApi[]
>;

export type AnyCreateScenarioApi = CreateScenarioApi<AnyCreateMockApi[]>;
