import { AnyCreateMockReturnType } from '@dynamic-msw/core';
import { EntityId } from '@reduxjs/toolkit';

export type CreateMockReturnValueMap = Record<
  EntityId,
  AnyCreateMockReturnType
>;
