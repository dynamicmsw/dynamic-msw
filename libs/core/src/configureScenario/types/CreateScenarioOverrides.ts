import { type ScenarioMockData } from './ScenarioMockData';
import { type PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { type DashboardConfig } from '../../types/DashboardConfig';
import { type AnyCreateMockPublicApi } from '../../configureMock/types/AnyCreateMockApi';

export type CreateScenarioOverrides<
  TCreateMocks extends AnyCreateMockPublicApi[],
> = {
  parameters?: Partial<PrimitiveScenarioParamaters<TCreateMocks>>;
  data?: Partial<ScenarioMockData<TCreateMocks>>;
  dashboardConfig?: DashboardConfig;
};
