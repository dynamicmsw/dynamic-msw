import { type RequestHandler } from 'msw';

export type HandleUpdate = (updatedHandlers: RequestHandler[]) => unknown;
