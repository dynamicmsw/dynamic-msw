import CreateMockApi from '../configureMock/CreateMockApi';
import { MockParamaterObject } from './MockParamater';
import { CreateMockPublicApi } from '../configureMock/CreateMockApi';

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
