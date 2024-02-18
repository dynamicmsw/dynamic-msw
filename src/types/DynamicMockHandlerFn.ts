import { RequestHandler } from "msw";
import { ConvertMockParameters } from "./ConvertMockParameters";
import { MockParamaterObject } from "./MockParamater";

export type DynamicMockHandlerFn<
  TMockParamaterObject extends MockParamaterObject = MockParamaterObject
> = (
  parameters: ConvertMockParameters<TMockParamaterObject>
) => RequestHandler[] | RequestHandler;
