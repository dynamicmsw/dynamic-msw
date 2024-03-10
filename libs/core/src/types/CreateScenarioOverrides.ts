import { type ScenarioMockData } from './ScenarioMockData';
import { type PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { type DashboardConfig } from './DashboardConfig';
import { type MockData } from './MockData';
import { type MockParameterPrimitiveType } from './MockParamater';
import { type AnyCreateMockPublicApi } from './AnyCreateMockApi';

export type CreateScenarioOverrides<
  TCreateMocks extends AnyCreateMockPublicApi[],
> = {
  parameters?: Partial<PrimitiveScenarioParamaters<TCreateMocks>>;
  data?: Partial<ScenarioMockData<TCreateMocks>>;
  dashboardConfig?: DashboardConfig;
};

export type AnyInternalScenarioDataOverrides = Record<
  string,
  MockData | undefined
>;
export type AnyInternalScenarioParameterOverrides = Record<
  string,
  Record<string, MockParameterPrimitiveType | undefined> | undefined
>;
