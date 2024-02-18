/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "msw";

export type SupportedRequestHandler = RequestHandler<any, any, any, never>;
