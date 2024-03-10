import {
  SetupWorkerApi as SetupWorkerApiOriginal,
  StartOptions,
} from 'msw/browser';
import { RequestHandler } from 'msw';

import { AllPublicHandlerTypes } from '@dynamic-msw/core';
import { Setup } from '@dynamic-msw/setup';

export default class SetupWorkerApi extends SetupWorkerApiOriginal {
  private dynamicSetup: Setup;
  constructor(handlers: AllPublicHandlerTypes[], isDashboard: boolean) {
    super();
    this.dynamicSetup = new Setup(handlers, this.handleUpdate, isDashboard);
  }
  private handleUpdate = (requestHandlers: RequestHandler[]) => {
    super.use(...requestHandlers);
  };
  override resetHandlers = (...nextHandlers: AllPublicHandlerTypes[]) => {
    this.dynamicSetup.resetHandlers(...nextHandlers);
    super.resetHandlers(...this.dynamicSetup.initializedHandlers!);
  };
  override use = (...nextHandlers: AllPublicHandlerTypes[]) => {
    this.dynamicSetup.use(...nextHandlers);
    super.use(...this.dynamicSetup.initializedHandlers!);
  };
  override start = (options?: StartOptions) => {
    this.dynamicSetup.start();
    super.resetHandlers(...this.dynamicSetup.initializedHandlers!);
    return super.start(options);
  };
  override stop = () => {
    this.dynamicSetup.stop();
    return super.stop();
  };
}
