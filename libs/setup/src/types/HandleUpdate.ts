import { RequestHandler } from 'msw';

export type HandleUpdate = (updatedHandlers: RequestHandler[]) => unknown;
