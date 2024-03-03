import { PrimitiveMockParameters } from './PrimitiveMockParameters';
import { DashboardConfig } from './DashboardConfig';
import { MockData } from './MockData';
import { MockParamaterObject } from './MockParamater';

export type CreateMockOverrides<TMockParameterObject, TMockData> =
  MockParametersOverrides<TMockParameterObject> &
    MockDataOverrides<TMockData> &
    DashboardConfigOverrides;

type MockParametersOverrides<TMockParameterObject> =
  TMockParameterObject extends MockParamaterObject
    ? { parameters?: Partial<PrimitiveMockParameters<TMockParameterObject>> }
    : { parameters?: never };

type MockDataOverrides<TMockData> = TMockData extends MockData
  ? { data?: TMockData }
  : { data?: never };

type DashboardConfigOverrides = { dashboardConfig?: DashboardConfig };
