import { DashboardConfig } from './DashboardConfig';
import { MockData } from './MockData';
import { MockParamaterObject } from './MockParamater';

export type CreateMockConfig<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
> = {
  key: TMockKey;
  parameters?: TMockParameterObject & MockParamaterObject;
  data?: TMockData & MockData;
  dashboardConfig?: DashboardConfig;
};
