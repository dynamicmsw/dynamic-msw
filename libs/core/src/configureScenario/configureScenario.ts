import { DashboardConfig } from '../types/DashboardConfig';
import { CreateScenarioOverrides } from '../types/CreateScenarioOverrides';
import CreateScenarioApi, {
  CreateScenarioPublicApi,
} from './CreateScenarioApi';
import { AnyCreateMockPublicApi } from '../types/AnyCreateMockApi';

export default function configureScenario<
  TCreateMocks extends AnyCreateMockPublicApi[]
>({
  key,
  mocks,
  dashboardConfig,
}: {
  key: string;
  mocks: [...TCreateMocks];
  dashboardConfig?: DashboardConfig;
}): (
  overrides?: CreateScenarioOverrides<TCreateMocks>
) => CreateScenarioPublicApi<TCreateMocks> {
  return (overrides) => {
    return new CreateScenarioApi(key, mocks, dashboardConfig, overrides);
  };
}
