import CreateScenarioApi, {
  CreateScenarioPublicApi,
} from '../configureScenario/CreateScenarioApi';
import { AnyCreateMockApi } from './AnyCreateMockApi';
import { AnyCreateMockPublicApi } from './AnyCreateMockApi';

export type AnyCreateScenarioPublicApi = CreateScenarioPublicApi<
  AnyCreateMockPublicApi[]
>;

export type AnyCreateScenarioApi = CreateScenarioApi<AnyCreateMockApi[]>;
