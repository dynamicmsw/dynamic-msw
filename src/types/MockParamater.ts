export type MockParamaterObject = Record<string, MockParameterType>;

export type MockParameterType =
  | MockParameterSelect
  | MockParameterValueType
  | MockParameterWithInputType
  | MockParameterWithNullableInputType;

export type MockParameterValueType = number | boolean | string;

export type DashboardInputType = "string" | "number" | "boolean";

export type NormalizedMockParameter = (
  | MockParameterWithInputType
  | MockParameterSelect
  | MockParameterWithNullableInputType
) & { currentValue?: MockParameterValueType };

export type NormalizedMockParameters = Record<string, NormalizedMockParameter>;

export interface MockParameterWithInputType {
  dashboardInputType: DashboardInputType;
  defaultValue: MockParameterValueType;
  selectOptions?: undefined;
  nullable?: never;
}
export interface MockParameterWithNullableInputType {
  dashboardInputType: DashboardInputType;
  defaultValue?: MockParameterValueType;
  nullable: true;
  selectOptions?: undefined;
}

export interface MockParameterSelect {
  selectOptions: ReadonlyArray<MockParameterValueType>;
  defaultValue?: MockParameterValueType;
  dashboardInputType?: undefined;
  nullable?: never;
}
