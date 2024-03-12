import { type CreateMockOverrides } from './types/CreateMockOverrides';
import { type MockConfig } from './types/MockConfig';
import { type DynamicHandlerFn } from './types/DynamicHandlerFn';
import CreateMockApi, { type CreateMockPublicApi } from './CreateMockApi';

export default function configureMock<
  TMockKey extends string,
  TMockParameterObject,
  TMockData,
>(
  {
    key,
    parameters,
    data,
    dashboardConfig,
  }: MockConfig<TMockKey, TMockParameterObject, TMockData>,
  initializer: DynamicHandlerFn<TMockParameterObject, TMockData>,
): (
  overrides?: CreateMockOverrides<TMockParameterObject, TMockData>,
) => CreateMockPublicApi<TMockKey, TMockParameterObject, TMockData> {
  return (overrides) => {
    return new CreateMockApi(
      { key, parameters, data, dashboardConfig },
      initializer,
      overrides,
    );
  };
}
