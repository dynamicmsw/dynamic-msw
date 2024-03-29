import { type AnyCreateMockPublicApi } from './AnyCreateMockApi';
import { type OmitUndefinedObjKeys } from './utility-types';

export type PrimitiveScenarioParamaters<
  TCreateMocks extends AnyCreateMockPublicApi[],
> = TCreateMocks extends [
  infer Curr extends AnyCreateMockPublicApi,
  ...infer Rest extends AnyCreateMockPublicApi[],
]
  ? PrimitiveScenarioParamaters<Rest> extends never
    ? OmitUndefinedObjKeys<{
        [Key in Curr['mockKey']]: Curr['updateParameters'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateParameters']>[0]
          : undefined;
      }>
    : OmitUndefinedObjKeys<{
        [Key in Curr['mockKey']]: Curr['updateParameters'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateParameters']>[0]
          : undefined;
      }> &
        PrimitiveScenarioParamaters<Rest>
  : never;
