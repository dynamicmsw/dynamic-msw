import { type RequestHandler } from 'msw';
import { type Store } from '../state/store';
import { isDynamicMockHandler } from './isDynamicMockHandler';
import { isDynamicScenarioHandler } from './isDynamicScenarioHandler';
import { type AllHandlerTypes } from './types/AllHandlerTypes';
import { type WebSocketHandler } from 'msw/lib/core/handlers/WebSocketHandler';
import { mockParametersActions } from '../state/mock/mockParameters.slice';
import { mockDataActions } from '../state/mock/mockData.slice';
import { selectMockDashboardConfigById } from '../state/mock/mockDashboard.slice';
import { selectScenarioById } from '../state/scenario.slice';

export default function setup(
  handlers: AllHandlerTypes[],
  store: Store,
  isDashboard = false,
): {
  handlers: Array<RequestHandler | WebSocketHandler>;
  resetAll: () => void;
} {
  const internalHandlers = handlers as AllHandlerTypes[];
  internalHandlers.forEach((handler) => {
    if (isDynamicMockHandler(handler)) {
      handler.initialize(store, undefined);
    } else if (isDynamicScenarioHandler(handler)) {
      handler.initialize(store);
    }
  });
  return {
    resetAll: () => {
      store.dispatch(mockParametersActions.resetAll());
      store.dispatch(mockDataActions.resetAll());
    },
    handlers: internalHandlers.flatMap((handler) => {
      if (isDynamicMockHandler(handler)) {
        const mockDashboardState = selectMockDashboardConfigById(
          handler.entityId,
        )(store.getState());

        if (isDashboard && !mockDashboardState.isActive) return [];
        return handler.handlers;
      }
      if (isDynamicScenarioHandler(handler)) {
        const scenarioDashboardState = selectScenarioById(handler.scenarioKey)(
          store.getState(),
        );

        if (isDashboard && !scenarioDashboardState.isActive) return [];
        return handler.handlers;
      }
      return handler;
    }),
  };
}
