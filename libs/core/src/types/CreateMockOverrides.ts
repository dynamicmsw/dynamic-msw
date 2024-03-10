import { PrimitiveMockParameters } from './PrimitiveMockParameters';
import { DashboardConfig } from './DashboardConfig';
import { MockData } from './MockData';
import { MockParamaterObject } from './MockParamater';

export interface CreateMockOverrides<TMockParameterObject, TMockData>
  extends MockParametersOverrides<TMockParameterObject>,
    MockDataOverrides<TMockData>,
    DashboardConfigOverrides {}

interface MockParametersOverrides<TMockParameterObject> {
  parameters?: TMockParameterObject extends MockParamaterObject
    ? Partial<PrimitiveMockParameters<TMockParameterObject>>
    : never;
}

interface MockDataOverrides<TMockData> {
  data?: TMockData extends MockData ? TMockData : never;
}

type DashboardConfigOverrides = { dashboardConfig?: DashboardConfig };
