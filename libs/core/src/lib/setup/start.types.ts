import type { CreateMockReturnType } from '../createMock/createMock';
import type { Config, MswHandlers } from '../types';

export interface SharedStartConfig {
  mocks?: CreateMockReturnType[];
  nonDynamicMocks?: MswHandlers[];
  config?: Config;
}
