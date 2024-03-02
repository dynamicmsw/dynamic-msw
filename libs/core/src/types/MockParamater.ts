export type MockParamaterObject = Record<string, MockParameterType>;

export type MockParameterType =
  | MockParameterSelect
  | MockParameterPrimitiveType
  | MockParameterWithInputType
  | MockParameterWithNullableInputType;

export type MockParameterPrimitiveType = number | boolean | string;

export type DashboardInputType = 'string' | 'number' | 'boolean';

export type NormalizedMockParameter = (
  | MockParameterWithInputType
  | MockParameterSelect
  | MockParameterWithNullableInputType
) & { currentValue?: MockParameterPrimitiveType };

export type NormalizedMockParameters = Record<string, NormalizedMockParameter>;

export interface MockParameterWithInputType {
  dashboardInputType: DashboardInputType;
  defaultValue: MockParameterPrimitiveType;
  selectOptions?: undefined;
  nullable?: never;
}
export interface MockParameterWithNullableInputType {
  dashboardInputType: DashboardInputType;
  defaultValue?: MockParameterPrimitiveType;
  nullable: true;
  selectOptions?: undefined;
}

export interface MockParameterSelect {
  selectOptions: ReadonlyArray<MockParameterPrimitiveType>;
  defaultValue?: MockParameterPrimitiveType;
  dashboardInputType?: undefined;
  nullable?: never;
}
