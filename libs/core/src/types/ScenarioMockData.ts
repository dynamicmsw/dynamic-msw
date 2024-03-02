import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { OmitUndefinedObjKeys } from './utility-types';

export type ScenarioMockData<TCreateMocks extends AnyCreateMockReturnType[]> =
  TCreateMocks extends [
    infer Curr extends AnyCreateMockReturnType,
    ...infer Rest extends AnyCreateMockReturnType[]
  ]
    ? ScenarioMockData<Rest> extends never
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
          ScenarioMockData<Rest>
    : never;
