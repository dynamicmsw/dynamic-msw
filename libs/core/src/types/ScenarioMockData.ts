import { type AnyCreateMockPublicApi } from './AnyCreateMockApi';
import { type OmitUndefinedObjKeys } from './utility-types';

export type ScenarioMockData<TCreateMocks extends AnyCreateMockPublicApi[]> =
  TCreateMocks extends [
    infer Curr extends AnyCreateMockPublicApi,
    ...infer Rest extends AnyCreateMockPublicApi[],
  ]
    ? ScenarioMockData<Rest> extends never
      ? OmitUndefinedObjKeys<{
          [Key in Curr['mockKey']]: Curr['updateData'] extends (
            ...args: any
          ) => any
            ? Parameters<Curr['updateData']>[0]
            : undefined;
        }>
      : OmitUndefinedObjKeys<{
          [Key in Curr['mockKey']]: Curr['updateData'] extends (
            ...args: any
          ) => any
            ? Parameters<Curr['updateData']>[0]
            : undefined;
        }> &
          ScenarioMockData<Rest>
    : never;
