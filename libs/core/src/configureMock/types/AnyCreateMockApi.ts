import type CreateMockApi from '../CreateMockApi';
import { type MockParamaterObject } from './MockParamater';
import { type CreateMockPublicApi } from '../CreateMockApi';

export type AnyCreateMockPublicApi = CreateMockPublicApi<
  string,
  MockParamaterObject | undefined,
  any
>;

export type AnyCreateMockApi = CreateMockApi<
  string,
  MockParamaterObject | undefined,
  any
>;
