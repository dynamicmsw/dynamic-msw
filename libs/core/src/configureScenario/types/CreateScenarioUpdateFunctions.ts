import { type AnyCreateMockPublicApi } from '../../configureMock/types/AnyCreateMockApi';
import { type PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { type ScenarioMockData } from './ScenarioMockData';

export type UpdateScenarioParametersFn<
  TCreateMocks extends AnyCreateMockPublicApi[],
> = (parameters: Partial<PrimitiveScenarioParamaters<TCreateMocks>>) => void;

export type UpdateScenarioDataFn<
  TCreateMocks extends AnyCreateMockPublicApi[],
> = (data: Partial<ScenarioMockData<TCreateMocks>>) => void;
