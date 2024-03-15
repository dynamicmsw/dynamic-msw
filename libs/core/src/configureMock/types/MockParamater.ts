export interface MockParamaterObject {
  [key: string]: MockParameterType;
}

export type MockParameterType =
  | MockParameterPrimitiveType
  | MockParameterSelect
  | MockParameterWithInputType
  | NullableMockParameter
  | NullableMockParameterSelect;

export type MockParameterPrimitiveType = number | boolean | string;

export type DashboardInputType = 'string' | 'number' | 'boolean';

export type NormalizedMockParameter = (
  | MockParameterWithInputType
  | MockParameterSelect
  | NullableMockParameter
  | NullableMockParameterSelect
) & { currentValue?: MockParameterPrimitiveType | null };

export type NormalizedMockParameters = Record<string, NormalizedMockParameter>;

export interface MockParameterWithInputType {
  dashboardInputType: DashboardInputType;
  defaultValue: MockParameterPrimitiveType;
  selectOptions?: undefined;
  nullable?: never;
}

export interface NullableMockParameter {
  dashboardInputType: DashboardInputType;
  defaultValue?: MockParameterPrimitiveType | null;
  nullable: true;
  selectOptions?: undefined;
}

export interface MockParameterSelect {
  selectOptions: ReadonlyArray<MockParameterPrimitiveType>;
  defaultValue: MockParameterPrimitiveType;
  nullable?: undefined;
  dashboardInputType?: undefined;
}

interface NullableMockParameterSelect {
  selectOptions: ReadonlyArray<MockParameterPrimitiveType>;
  defaultValue?: MockParameterPrimitiveType | null;
  nullable: true;
  dashboardInputType?: undefined;
}
