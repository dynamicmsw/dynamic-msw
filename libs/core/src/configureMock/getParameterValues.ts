import {
  type MockParamaterObject,
  type NormalizedMockParameters,
} from './types/MockParamater';
import { type PrimitiveMockParameters } from './types/PrimitiveMockParameters';

export function getParameterValues(
  parameters?: NormalizedMockParameters,
): PrimitiveMockParameters<MockParamaterObject> | undefined {
  if (!parameters) return undefined;
  return Object.entries(parameters).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value.currentValue ?? value.defaultValue ?? null,
    };
  }, {});
}
