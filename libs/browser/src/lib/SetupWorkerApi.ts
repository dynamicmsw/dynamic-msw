import { SetupWorkerApi as SetupWorkerApiOriginal } from 'msw/browser';
import { RequestHandler } from 'msw';
import { createStore } from '@dynamic-msw/core';

import { AllHandlerTypes } from '@dynamic-msw/core';
import { Setup } from '@dynamic-msw/setup';

export default class SetupWorkerApi extends SetupWorkerApiOriginal {
  private dynamicSetup: Setup;
  constructor(isDashboard: boolean, handlers: AllHandlerTypes[]) {
    super();
    this.dynamicSetup = new Setup(
      createStore(isDashboard, isDashboard).store,
      handlers,
      this.handleUpdate
    );
    super.resetHandlers(...this.dynamicSetup.initializedHandlers!);
  }
  private handleUpdate = (requestHandlers: RequestHandler[]) => {
    super.use(...requestHandlers);
  };
  override resetHandlers = (...nextHandlers: AllHandlerTypes[]) => {
    this.dynamicSetup.resetHandlers(...nextHandlers);
    super.resetHandlers(...this.dynamicSetup.initializedHandlers!);
  };
  override use = (...nextHandlers: AllHandlerTypes[]) => {
    this.dynamicSetup.use(...nextHandlers);
    super.use(...this.dynamicSetup.initializedHandlers!);
  };
}
