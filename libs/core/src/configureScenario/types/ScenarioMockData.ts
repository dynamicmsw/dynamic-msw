import { type AnyCreateMockPublicApi } from '../../configureMock/types/AnyCreateMockApi';
import { type OmitUndefinedObjKeys } from '../../types/utility-types';

export type ScenarioMockData<TCreateMocks extends AnyCreateMockPublicApi[]> =
  TCreateMocks extends [
    infer Curr extends AnyCreateMockPublicApi,
    ...infer Rest extends AnyCreateMockPublicApi[],
  ]
    ? ScenarioMockData<Rest> extends never
      ? OmitUndefinedObjKeys<{
          [Key in Curr['mockKey']]: Curr['setData'] extends (
            ...args: any
          ) => any
            ? Parameters<Curr['setData']>[0]
            : undefined;
        }>
      : OmitUndefinedObjKeys<{
          [Key in Curr['mockKey']]: Curr['setData'] extends (
            ...args: any
          ) => any
            ? Parameters<Curr['setData']>[0]
            : undefined;
        }> &
          ScenarioMockData<Rest>
    : never;
