import { type PrimitiveMockParameters } from './PrimitiveMockParameters';
import { type MockParamaterObject } from './MockParamater';
import { type MockData } from './MockData';
import { type HandlerReturnType } from './HandlerReturnType';

export type DynamicHandlerFn<TMockParamaterObject, TMockData> =
  TMockParamaterObject extends MockParamaterObject
    ? TMockData extends MockData
      ? (ctx: {
          getParams: () => PrimitiveMockParameters<TMockParamaterObject>;
          getData: () => TMockData;
          setData: SetMockData<TMockData>;
        }) => HandlerReturnType
      : (ctx: {
          getParams: () => PrimitiveMockParameters<TMockParamaterObject>;
          getData: never;
          setData: never;
        }) => HandlerReturnType
    : TMockData extends MockData
      ? (ctx: {
          getParams: never;
          getData: () => TMockData;
          setData: SetMockData<TMockData>;
        }) => HandlerReturnType
      : () => HandlerReturnType;

export type UnknownDynamicHandlerFn = DynamicHandlerFn<
  MockParamaterObject,
  MockData
>;

type SetMockData<TMockData extends MockData> = (data: TMockData) => void;
