import { type PrimitiveMockParameters } from './PrimitiveMockParameters';
import { type DashboardConfig } from './DashboardConfig';
import { type MockData } from './MockData';
import { type MockParamaterObject } from './MockParamater';

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
