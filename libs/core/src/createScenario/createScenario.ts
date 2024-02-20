import { Store } from '@reduxjs/toolkit';
import { CreateMockReturnType } from '../createMock/createMock';
import { DashboardConfig } from '../types/DashboardConfig';
import { createScenarioActions } from '../state/createScenario.slice';

export default function createScenario<
  TCreateMocks extends CreateMockReturnType[]
>({
  key,
  mocks,
  dashboardConfig,
}: {
  key: string;
  mocks: [...TCreateMocks];
  dashboardConfig?: DashboardConfig;
}): CreateScenarioReturnType<TCreateMocks> {
  const mocksMap = mocks.reduce((acc, curr) => {
    acc[curr.internals.key] = curr;
    return acc;
  }, {} as Record<string, CreateMockReturnType>);
  return {
    updateParameters: (
      parameters: Partial<ConvertedScenarioParamaters<TCreateMocks>>
    ) => {
      Object.entries(parameters).forEach(([mockKey, mockParameters]) => {
        mocksMap[mockKey].updateParameters(mockParameters);
      });
    },
    reset: () => {
      mocks.forEach((mock) => {
        mock.reset();
      });
    },
    internals: {
      initialize: (globalStore: Store) => {
        globalStore.dispatch(
          createScenarioActions.setOne({ dashboardConfig, id: key })
        );
        mocks.forEach((mock) => {
          mock.internals.initialize(globalStore, key);
        });
      },
      getMocks: () => mocks,
      isCreateScenario: true,
    },
  };
}

export type CreateScenarioReturnType<
  TCreateMocks extends CreateMockReturnType[] = CreateMockReturnType[]
> = {
  updateParameters: (
    parameters: Partial<ConvertedScenarioParamaters<TCreateMocks>>
  ) => void;
  reset: () => void;
  internals: {
    initialize: (globalStore: Store) => void;
    getMocks: () => TCreateMocks;
    isCreateScenario: true;
  };
};

type ConvertedScenarioParamaters<TCreateMocks extends CreateMockReturnType[]> =
  TCreateMocks extends [
    infer Curr extends CreateMockReturnType,
    ...infer Rest extends CreateMockReturnType[]
  ]
    ? ConvertedScenarioParamaters<Rest> extends never
      ? {
          [Key in Curr['internals']['key']]: Parameters<
            Curr['updateParameters']
          >[0];
        }
      : {
          [Key in Curr['internals']['key']]: Parameters<
            Curr['updateParameters']
          >[0];
        } & ConvertedScenarioParamaters<Rest>
    : never;
