import {
  DashboardInputType,
  MockParamaterObject,
  MockParameterType,
  MockParameterPrimitiveType,
  NormalizedMockParameter,
  NormalizedMockParameters,
} from '../types/MockParamater';

export default function normalizeParameters(
  parameters: MockParamaterObject | undefined,
  overrides:
    | Record<string, MockParameterPrimitiveType | undefined | null>
    | undefined
): NormalizedMockParameters {
  if (parameters === undefined) {
    return {} as NormalizedMockParameters;
  }
  return Object.entries(parameters).reduce<NormalizedMockParameters>(
    (prev, [key, parameter]) => {
      const currentOverride = overrides?.[key];
      return {
        ...prev,
        [key]: currentOverride
          ? { ...normalizeParameter(parameter), defaultValue: currentOverride }
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
  if (isObject) {
    return option;
  }
  return {
    dashboardInputType: inferInputType(option),
    defaultValue: option,
  };
}

function inferInputType(value: MockParameterPrimitiveType): DashboardInputType {
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
