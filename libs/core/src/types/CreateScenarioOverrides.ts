import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { ConvertScenarioData } from './ConvertScenarioData';
import { ConvertScenarioParamaters } from './ConvertScenarioParamaters';
import { DashboardConfig } from './DashboardConfig';

export type CreateScenarioOverrides<
  TCreateMocks extends AnyCreateMockReturnType[]
> = {
  parameters?: Partial<ConvertScenarioParamaters<TCreateMocks>>;
  data?: Partial<ConvertScenarioData<TCreateMocks>>;
  dashboardConfig?: DashboardConfig;
};
