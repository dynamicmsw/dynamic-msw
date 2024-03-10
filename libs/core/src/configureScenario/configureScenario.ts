import { type DashboardConfig } from '../types/DashboardConfig';
import { type CreateScenarioOverrides } from '../types/CreateScenarioOverrides';
import CreateScenarioApi, {
  type CreateScenarioPublicApi,
} from './CreateScenarioApi';
import { type AnyCreateMockPublicApi } from '../types/AnyCreateMockApi';

export default function configureScenario<
  TCreateMocks extends AnyCreateMockPublicApi[],
>({
  key,
  mocks,
  dashboardConfig,
}: {
  key: string;
  mocks: [...TCreateMocks];
  dashboardConfig?: DashboardConfig;
}): (
  overrides?: CreateScenarioOverrides<TCreateMocks>,
) => CreateScenarioPublicApi<TCreateMocks> {
  return (overrides) => {
    return new CreateScenarioApi(key, mocks, dashboardConfig, overrides);
  };
}
