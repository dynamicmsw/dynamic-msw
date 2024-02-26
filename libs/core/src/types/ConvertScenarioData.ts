import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { OmitUndefinedObjKeys } from './utility-types';

export type ConvertScenarioData<
  TCreateMocks extends AnyCreateMockReturnType[]
> = TCreateMocks extends [
  infer Curr extends AnyCreateMockReturnType,
  ...infer Rest extends AnyCreateMockReturnType[]
]
  ? ConvertScenarioData<Rest> extends never
    ? OmitUndefinedObjKeys<{
        [Key in Curr['internals']['key']]: Curr['updateData'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateData']>[0]
          : undefined;
      }>
    : OmitUndefinedObjKeys<{
        [Key in Curr['internals']['key']]: Curr['updateData'] extends (
          ...args: any
        ) => any
          ? Parameters<Curr['updateData']>[0]
          : undefined;
      }> &
        ConvertScenarioData<Rest>
  : never;
