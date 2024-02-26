import { Store } from '@reduxjs/toolkit';
import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { DashboardConfig } from '../types/DashboardConfig';
import { configureScenarioActions } from '../state/createScenario.slice';
import { ConvertScenarioParamaters } from '../types/ConvertScenarioParamaters';
import { ConvertScenarioData } from '../types/ConvertScenarioData';
import { CreateScenarioOverrides } from '../types/CreateScenarioOverrides';

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
}): (
  overrides?: CreateScenarioOverrides<TCreateMocks>
) => CreateScenarioReturnType<TCreateMocks> {
  return (overrides) => {
    const mocksMap = mocks.reduce((acc, curr) => {
      acc[curr.internals.key] = curr;
      return acc;
    }, {} as Record<string, AnyCreateMockReturnType>);

    if (overrides?.data) {
      Object.entries(overrides?.data).forEach(([mockKey, mockData]) => {
        mocksMap[mockKey].internals.overrideData(mockData);
      });
    }
    if (overrides?.parameters) {
      Object.entries(overrides?.parameters).forEach(([mockKey, parameters]) => {
        mocksMap[mockKey].internals.overrideParameters(parameters);
      });
    }
    return {
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
      reset: () => {
        mocks.forEach((mock) => {
          mock.reset();
        });
      },
      internals: {
        initialize: (globalStore) => {
          globalStore.dispatch(
            configureScenarioActions.setOne({
              dashboardConfig: {
                ...dashboardConfig,
                ...overrides?.dashboardConfig,
              },
              id: key,
            })
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
  updateParameters: (
    parameters: Partial<ConvertScenarioParamaters<TCreateMocks>>
  ) => void;
  updateData: (data: Partial<ConvertScenarioData<TCreateMocks>>) => void;
  reset: () => void;
  internals: {
    initialize: (globalStore: Store) => void;
    getMocks: () => TCreateMocks;
    isCreateScenario: true;
  };
};
