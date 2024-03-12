import { type RequestHandler } from 'msw';
import { type WebSocketHandler } from 'msw/lib/core/handlers/WebSocketHandler';

export type HandlerReturnType =
  | RequestHandler
  | WebSocketHandler
  | Array<RequestHandler | WebSocketHandler>;
