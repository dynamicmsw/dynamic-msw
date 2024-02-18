import { CreateMockEntity } from '@dynamic-msw/core';

export function getParameterValues(createMockEntity: CreateMockEntity) {
  if (!createMockEntity.parameters) return {};
  return Object.entries(createMockEntity.parameters).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.currentValue || value.defaultValue || null,
    }),
    {}
  );
}
