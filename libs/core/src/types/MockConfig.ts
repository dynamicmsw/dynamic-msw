import { type DashboardConfig } from './DashboardConfig';
import { type MockData } from './MockData';
import { type MockParamaterObject } from './MockParamater';

export interface MockConfig<
  TMockKey extends string,
  TMockParameterObject,
  TMockData,
> {
  key: TMockKey;
  parameters?: TMockParameterObject & MockParamaterObject;
  data?: TMockData & MockData;
  dashboardConfig?: DashboardConfig;
}
