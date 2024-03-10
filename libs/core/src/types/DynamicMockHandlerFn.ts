import { type RequestHandler } from 'msw';
import { type PrimitiveMockParameters } from './PrimitiveMockParameters';
import { type MockParamaterObject } from './MockParamater';
import { type MockData } from './MockData';

export type DynamicMockHandlerFn<TMockParamaterObject, TMockData> =
  TMockParamaterObject extends MockParamaterObject
    ? TMockData extends MockData
      ? (
          parameters: PrimitiveMockParameters<TMockParamaterObject>,
          data: TMockData,
          updateData: UpdateMockData<TMockData>,
        ) => RequestHandler[] | RequestHandler
      : (
          parameters: PrimitiveMockParameters<TMockParamaterObject>,
        ) => RequestHandler[] | RequestHandler
    : TMockData extends MockData
      ? (
          parameters: undefined,
          data: TMockData,
          updateData: UpdateMockData<TMockData>,
        ) => RequestHandler[] | RequestHandler
      : () => RequestHandler[] | RequestHandler;

export type AnyDynamicMockHandlerFn = DynamicMockHandlerFn<
  MockParamaterObject,
  MockData
>;

type UpdateMockData<TMockData extends MockData> = (data: TMockData) => void;
