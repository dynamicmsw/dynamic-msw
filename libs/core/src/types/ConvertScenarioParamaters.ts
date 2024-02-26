import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { OmitUndefinedObjKeys } from '../types/utility-types';

export type ConvertScenarioParamaters<
  TCreateMocks extends AnyCreateMockReturnType[]
> = TCreateMocks extends [
  infer Curr extends AnyCreateMockReturnType,
  ...infer Rest extends AnyCreateMockReturnType[]
]
  ? ConvertScenarioParamaters<Rest> extends never
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
        ConvertScenarioParamaters<Rest>
  : never;
