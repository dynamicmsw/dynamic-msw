import { ScenarioMockData } from './ScenarioMockData';
import { PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { DashboardConfig } from './DashboardConfig';
import { MockData } from './MockData';
import { MockParameterPrimitiveType } from './MockParamater';
import { AnyCreateMockPublicApi } from './AnyCreateMockApi';

export type CreateScenarioOverrides<
  TCreateMocks extends AnyCreateMockPublicApi[]
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
