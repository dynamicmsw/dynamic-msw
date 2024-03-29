import { type CreateMockEntity } from '@dynamic-msw/core';

export function getParameterValues(configureMockEntity: CreateMockEntity) {
  if (!configureMockEntity.parameters) return {};
  return Object.entries(configureMockEntity.parameters).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]: value.currentValue ?? value.defaultValue ?? null,
      };
    },
    {},
  );
}
