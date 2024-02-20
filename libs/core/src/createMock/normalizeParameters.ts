import {
  DashboardInputType,
  MockParamaterObject,
  MockParameterType,
  MockParameterValueType,
  NormalizedMockParameter,
  NormalizedMockParameters,
} from '../types/MockParamater';

export default function normalizeParameters(
  parameters: MockParamaterObject | undefined,
  overrides: Record<string, MockParameterValueType> | undefined
): NormalizedMockParameters {
  if (parameters === undefined) {
    return {} as NormalizedMockParameters;
  }
  return Object.entries(parameters).reduce<NormalizedMockParameters>(
    (prev, [key, parameter]) => {
      return {
        ...prev,
        [key]: overrides?.[key]
          ? { ...normalizeParameter(parameter), defaultValue: overrides[key] }
          : normalizeParameter(parameter),
      };
    },
    {} as NormalizedMockParameters
  );
}

function normalizeParameter(
  option: MockParameterType
): NormalizedMockParameter {
  const isObject = typeof option === 'object';
  if (isObject && option.selectOptions) {
    console.log(option);
  }
  if (isObject) {
    return option;
  }
  return {
    dashboardInputType: inferInputType(option),
    defaultValue: option,
  };
}

function inferInputType(value: MockParameterValueType): DashboardInputType {
  switch (typeof value) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
    default:
      return 'string';
  }
}
