import { type MockData } from './MockData';
import { type MockParamaterObject } from './MockParamater';
import { type PrimitiveMockParameters } from './PrimitiveMockParameters';

export type UpdateMockParametersFn<
  TMockParameterObject extends MockParamaterObject,
> = (updates: Partial<PrimitiveMockParameters<TMockParameterObject>>) => void;

export type MaybeUpdateMockParametersFn<TMockParameterObject> =
  TMockParameterObject extends MockParamaterObject
    ? UpdateMockParametersFn<TMockParameterObject>
    : never;

export type UpdateMockDataFn<TMockData extends MockData> = (
  newData: TMockData,
) => void;

export type MaybeUpdateMockDataFn<TMockData> = TMockData extends MockData
  ? UpdateMockDataFn<TMockData>
  : never;
