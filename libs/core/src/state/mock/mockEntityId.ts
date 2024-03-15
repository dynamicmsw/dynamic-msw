import { type EntityId } from '@reduxjs/toolkit';

export function getMockEntityId(
  mockKey: string,
  scenarioKey: string | undefined,
): EntityId {
  return `${
    scenarioKey ? `__scenarioKey__:${scenarioKey}` : ''
  }__mockKey__:${mockKey}`;
}

export function parseMockId(entityId: EntityId): {
  scenarioKey?: string;
  mockKey: string;
} {
  const splittedOnMockKey = entityId.toString().split('__mockKey__:');
  if (splittedOnMockKey[0]) {
    return {
      mockKey: splittedOnMockKey[1]!,
      scenarioKey: splittedOnMockKey[0].split('__scenarioKey__:')[1],
    };
  }
  return { mockKey: splittedOnMockKey[1]! };
}
