import type CreateMockApi from '../configureMock/CreateMockApi';
import { type MockParamaterObject } from './MockParamater';
import { type CreateMockPublicApi } from '../configureMock/CreateMockApi';

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
