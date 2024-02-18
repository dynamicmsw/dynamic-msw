import {
  DashboardInputType,
  MockParamaterObject,
  MockParameterSelect,
  MockParameterValueType,
  MockParameterWithInputType,
  MockParameterWithNullableInputType,
} from "./MockParamater";
import { ArrayElementType } from "./utility-types";

export type ConvertMockParameters<T extends MockParamaterObject> = {
  [K in keyof T]: T[K] extends MockParameterSelect
    ? ArrayElementType<T[K]["selectOptions"]>
    : T[K] extends MockParameterWithNullableInputType
    ? ConvertDashboardInputType<T[K]["dashboardInputType"]> | null
    : T[K] extends MockParameterWithInputType
    ? ConvertDashboardInputType<T[K]["dashboardInputType"]>
    : T[K] extends MockParameterValueType
    ? ConvertPrimitiveMockParameter<T[K]>
    : never;
};

type ConvertDashboardInputType<T extends DashboardInputType> =
  T extends "string"
    ? string
    : T extends "number"
    ? number
    : T extends "boolean"
    ? boolean
    : never;

type ConvertPrimitiveMockParameter<T extends MockParameterValueType> =
  T extends boolean ? boolean : T;
