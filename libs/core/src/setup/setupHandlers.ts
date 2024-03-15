import { createStore } from '../state/store';
import setup from './setup';
import {
  type AllHandlerTypes,
  type AllPublicHandlerTypes,
} from './types/AllHandlerTypes';

export default function setupHandlers(...handlers: AllPublicHandlerTypes[]) {
  return setup(handlers as AllHandlerTypes[], createStore(), false);
}
