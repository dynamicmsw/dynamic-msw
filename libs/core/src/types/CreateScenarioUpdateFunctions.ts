import { AnyCreateMockPublicApi } from './AnyCreateMockApi';
import { PrimitiveScenarioParamaters } from './PrimitiveScenarioParamaters';
import { ScenarioMockData } from './ScenarioMockData';

export type UpdateScenarioParametersFn<
  TCreateMocks extends AnyCreateMockPublicApi[]
> = (parameters: Partial<PrimitiveScenarioParamaters<TCreateMocks>>) => void;

export type UpdateScenarioDataFn<
  TCreateMocks extends AnyCreateMockPublicApi[]
> = (data: Partial<ScenarioMockData<TCreateMocks>>) => void;
