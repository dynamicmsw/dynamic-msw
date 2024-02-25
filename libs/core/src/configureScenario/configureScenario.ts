import { Store } from '@reduxjs/toolkit';
import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { DashboardConfig } from '../types/DashboardConfig';
import { configureScenarioActions } from '../state/createScenario.slice';
import { OmitUndefinedObjKeys } from '../types/utility-types';

export default function configureScenario<
  TCreateMocks extends AnyCreateMockReturnType[]
>({
  key,
  mocks,
  dashboardConfig,
}: {
  key: string;
  mocks: [...TCreateMocks];
  dashboardConfig?: DashboardConfig;
}): () => CreateScenarioReturnType<TCreateMocks> {
  return () => {
    const mocksMap = mocks.reduce((acc, curr) => {
      acc[curr.internals.key] = curr;
      return acc;
    }, {} as Record<string, AnyCreateMockReturnType>);
    return {
      // TODO: consider changing the API to override default values from the configureScenario returned function parameters
      overrideDefaultParameterValues: (parameters) => {
        Object.entries(parameters).forEach(([mockKey, mockParameters]) => {
          mocksMap[mockKey].overrideDefaultParameterValues?.(mockParameters!);
        });
      },
      updateParameters: (parameters) => {
        Object.entries(parameters).forEach(([mockKey, mockParameters]) => {
          mocksMap[mockKey].updateParameters?.(mockParameters!);
        });
      },
      updateData: (data) => {
        Object.entries(data).forEach(([mockKey, mockData]) => {
          mocksMap[mockKey].updateData?.(mockData!);
        });
      },
      overrideDefaultData: (data) => {
        Object.entries(data).forEach(([mockKey, mockData]) => {
          mocksMap[mockKey].overrideDefaultData?.(mockData!);
        });
      },
      reset: () => {
        mocks.forEach((mock) => {
          mock.reset();
        });
      },
      internals: {
        initialize: (globalStore) => {
          globalStore.dispatch(
            configureScenarioActions.setOne({ dashboardConfig, id: key })
          );
          mocks.forEach((mock) => {
            mock.internals.initialize(globalStore, key);
          });
        },
        getMocks: () => mocks,
        isCreateScenario: true,
      },
    };
  };
}

export type CreateScenarioReturnType<
  TCreateMocks extends AnyCreateMockReturnType[] = AnyCreateMockReturnType[]
> = {
  overrideDefaultParameterValues: (
    parameters: Partial<ConvertedScenarioParamaters<TCreateMocks>>
  ) => void;
  updateParameters: (
    parameters: Partial<ConvertedScenarioParamaters<TCreateMocks>>
  ) => void;
  overrideDefaultData: (
    data: Partial<ConvertedScenarioData<TCreateMocks>>
  ) => void;
  updateData: (data: Partial<ConvertedScenarioData<TCreateMocks>>) => void;
  reset: () => void;
  internals: {
    initialize: (globalStore: Store) => void;
    getMocks: () => TCreateMocks;
    isCreateScenario: true;
  };
};

type ConvertedScenarioParamaters<
  TCreateMocks extends AnyCreateMockReturnType[]
> = TCreateMocks extends [
  infer Curr extends AnyCreateMockReturnType,
  ...infer Rest extends AnyCreateMockReturnType[]
]
  ? ConvertedScenarioParamaters<Rest> extends never
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
        ConvertedScenarioParamaters<Rest>
  : never;

type ConvertedScenarioData<TCreateMocks extends AnyCreateMockReturnType[]> =
  TCreateMocks extends [
    infer Curr extends AnyCreateMockReturnType,
    ...infer Rest extends AnyCreateMockReturnType[]
  ]
    ? ConvertedScenarioData<Rest> extends never
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
          ConvertedScenarioData<Rest>
    : never;
