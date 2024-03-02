import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { OmitUndefinedObjKeys } from './utility-types';

export type PrimitiveScenarioParamaters<
  TCreateMocks extends AnyCreateMockReturnType[]
> = TCreateMocks extends [
  infer Curr extends AnyCreateMockReturnType,
  ...infer Rest extends AnyCreateMockReturnType[]
]
  ? PrimitiveScenarioParamaters<Rest> extends never
    ? OmitUndefinedObjKeys<{
        [Key in Curr['internals']['key']]: Curr['updateParameters'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateParameters']>[0]
          : undefined;
      }>
    : OmitUndefinedObjKeys<{
        [Key in Curr['internals']['key']]: Curr['updateParameters'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateParameters']>[0]
          : undefined;
      }> &
        PrimitiveScenarioParamaters<Rest>
  : never;
