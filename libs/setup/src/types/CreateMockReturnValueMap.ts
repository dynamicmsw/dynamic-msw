import { type AnyCreateMockApi } from '@dynamic-msw/core';
import { type EntityId } from '@reduxjs/toolkit';

export type CreateMockReturnValueMap = Record<EntityId, AnyCreateMockApi>;
