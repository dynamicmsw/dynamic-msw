import {
  type MockParamaterObject,
  type NormalizedMockParameters,
} from './types/MockParamater';
import { type PrimitiveMockParameters } from './types/PrimitiveMockParameters';

export default function overrideParamaters(
  source?: NormalizedMockParameters,
  overrides?: Partial<PrimitiveMockParameters<MockParamaterObject>>,
): NormalizedMockParameters | undefined {
  if (!overrides || !source) return source;
  return Object.entries(overrides).reduce((acc, [key, value]) => {
    const curr = acc[key];
    if (!curr) {
      throw new Error('Tried overriding a parameter that does not exist');
    }
    curr.defaultValue = value;
    return acc;
  }, source);
}
