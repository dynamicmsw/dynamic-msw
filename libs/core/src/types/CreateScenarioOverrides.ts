import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { ScenarioMockData } from './ScenarioMockData';
import { PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { DashboardConfig } from './DashboardConfig';

export type CreateScenarioOverrides<
  TCreateMocks extends AnyCreateMockReturnType[]
> = {
  parameters?: Partial<PrimitiveScenarioParamaters<TCreateMocks>>;
  data?: Partial<ScenarioMockData<TCreateMocks>>;
  dashboardConfig?: DashboardConfig;
};
