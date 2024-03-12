import {
  type DashboardInputType,
  type MockParamaterObject,
  type MockParameterSelect,
  type MockParameterPrimitiveType,
  type MockParameterWithInputType,
  type NullableMockParameter,
} from './MockParamater';
import { type ArrayElementType } from '../../types/utility-types';

export type PrimitiveMockParameters<T extends MockParamaterObject> = {
  [K in keyof T]: T[K] extends MockParameterSelect
    ? ArrayElementType<T[K]['selectOptions']>
    : T[K] extends NullableMockParameter
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
