import { RequestHandler } from 'msw';
import { ConvertMockParameters } from './ConvertMockParameters';
import { MockParamaterObject } from './MockParamater';
import { MockData } from './MockData';

export type DynamicMockHandlerFn<TMockParamaterObject, TMockData> =
  TMockParamaterObject extends MockParamaterObject
    ? TMockData extends MockData
      ? (
          parameters: ConvertMockParameters<TMockParamaterObject>,
          data: TMockData,
          updateData: UpdateMockData<TMockData>
        ) => RequestHandler[] | RequestHandler
      : (
          parameters: ConvertMockParameters<TMockParamaterObject>
        ) => RequestHandler[] | RequestHandler
    : TMockData extends MockData
    ? (
        parameters: undefined,
        data: TMockData,
        updateData: UpdateMockData<TMockData>
      ) => RequestHandler[] | RequestHandler
    : () => RequestHandler[] | RequestHandler;

export type AnyDynamicMockHandlerFn = DynamicMockHandlerFn<
  MockParamaterObject,
  MockData
>;

type UpdateMockData<TMockData extends MockData> = (data: TMockData) => void;
