import { DashboardConfig } from './DashboardConfig';
import { MockData } from './MockData';
import { MockParamaterObject } from './MockParamater';

export type ConfigureMockConfig<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
> = {
  key: TMockKey;
  parameters?: TMockParameterObject & MockParamaterObject;
  data?: TMockData & MockData;
  dashboardConfig?: DashboardConfig;
};
