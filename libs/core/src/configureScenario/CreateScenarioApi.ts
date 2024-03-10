import { configureScenarioActions } from '../state/createScenario.slice';
import { type Store } from '../state/store';
import { type AnyCreateMockPublicApi } from '../types/AnyCreateMockApi';
import { type AnyCreateMockApi } from '../types/AnyCreateMockApi';
import { type CreateScenarioOverrides } from '../types/CreateScenarioOverrides';
import {
  type UpdateScenarioDataFn,
  type UpdateScenarioParametersFn,
} from '../types/CreateScenarioUpdateFunctions';
import { type DashboardConfig } from '../types/DashboardConfig';
import createScenarioMockEntities, {
  type ScenarioMockEntities,
} from './createScenarioMockEntities';
import overrideScenarioData from './overrideScenarioData';
import overrideScenarioParameters from './overrideScenarioParameters';

export default class CreateScenarioApi<
  TCreateMocks extends AnyCreateMockPublicApi[],
> implements CreateScenarioPublicApi<TCreateMocks>
{
  public scenarioKey: string;
  private dashboardConfig?: DashboardConfig;
  private mockEntities: ScenarioMockEntities;
  private mocks: AnyCreateMockApi[];
  constructor(
    key: string,
    mocks: [...TCreateMocks],
    dashboardConfig?: DashboardConfig,
    overrides?: CreateScenarioOverrides<TCreateMocks>,
  ) {
    this.scenarioKey = key;
    this.mocks = mocks as unknown as AnyCreateMockApi[];
    this.mockEntities = createScenarioMockEntities(this.mocks);
    this.dashboardConfig = {
      ...dashboardConfig,
      ...overrides?.dashboardConfig,
    };
    if (overrides?.data) {
      overrideScenarioData(overrides.data, this.mockEntities);
    }
    if (overrides?.parameters) {
      overrideScenarioParameters(overrides.parameters, this.mockEntities);
    }
  }
  public updateParameters: UpdateScenarioParametersFn<TCreateMocks> = (
    parameters,
  ) => {
    Object.entries(parameters).forEach(([mockKey, mockParameters]) => {
      this.mockEntities[mockKey].updateParameters?.(mockParameters);
    });
  };
  public updateData: UpdateScenarioDataFn<TCreateMocks> = (data) => {
    Object.entries(data).forEach(([mockKey, mockData]) => {
      this.mockEntities[mockKey].updateData?.(mockData);
    });
  };
  public reset = () => {
    this.mocks.forEach((mock) => {
      mock.reset();
    });
  };
  public get internals(): CreateScenarioInternals {
    return {
      initialize: (globalStore) => {
        globalStore.dispatch(
          configureScenarioActions.setOne({
            dashboardConfig: this.dashboardConfig,
            id: this.scenarioKey,
          }),
        );
        this.mocks.forEach((mock) => {
          mock.internals.initialize(globalStore, this.scenarioKey, {
            isActiveByDefault: true,
            ...(this.dashboardConfig ?? undefined),
          });
        });
      },
      getMocks: () => this.mocks,
    };
  }
}

export interface CreateScenarioPublicApi<
  TCreateMocks extends AnyCreateMockPublicApi[],
> {
  updateParameters: UpdateScenarioParametersFn<TCreateMocks>;
  updateData: UpdateScenarioDataFn<TCreateMocks>;
  reset: () => void;
  scenarioKey: string;
}
export interface CreateScenarioInternals {
  initialize: (globalStore: Store) => void;
  getMocks: () => AnyCreateMockApi[];
}
