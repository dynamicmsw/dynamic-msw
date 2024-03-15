import { type OmitUndefinedObjKeys } from '../../types/utility-types';
import { type MockData } from './MockData';
import { type MockParamaterObject } from './MockParamater';
import { type PrimitiveMockParameters } from './PrimitiveMockParameters';

export type UpdateMockParametersFn<
  TMockParameterObject extends MockParamaterObject,
> = (
  updates: OmitUndefinedObjKeys<
    Partial<PrimitiveMockParameters<TMockParameterObject>>
  >,
) => void;

export type MaybeUpdateMockParametersFn<TMockParameterObject> =
  TMockParameterObject extends MockParamaterObject
    ? UpdateMockParametersFn<TMockParameterObject>
    : never;

export type SetMockDataFn<TMockData extends MockData> = (
  newData: TMockData,
) => void;

export type MaybeSetMockDataFn<TMockData> = TMockData extends MockData
  ? SetMockDataFn<TMockData>
  : never;
