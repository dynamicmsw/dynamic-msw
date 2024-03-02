import {
  DashboardInputType,
  MockParamaterObject,
  MockParameterSelect,
  MockParameterPrimitiveType,
  MockParameterWithInputType,
  MockParameterWithNullableInputType,
} from './MockParamater';
import { ArrayElementType } from './utility-types';

export type PrimitiveMockParameters<T extends MockParamaterObject> = {
  [K in keyof T]: T[K] extends MockParameterSelect
    ? ArrayElementType<T[K]['selectOptions']>
    : T[K] extends MockParameterWithNullableInputType
    ? GetDashboardInputType<T[K]['dashboardInputType']> | null
    : T[K] extends MockParameterWithInputType
    ? GetDashboardInputType<T[K]['dashboardInputType']>
    : T[K] extends MockParameterPrimitiveType
    ? GetPrimitiveMockParameterType<T[K]>
    : never;
};

type GetDashboardInputType<T extends DashboardInputType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never;

type GetPrimitiveMockParameterType<T extends MockParameterPrimitiveType> =
  T extends boolean ? boolean : T;
