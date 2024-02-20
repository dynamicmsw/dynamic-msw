import { SetupServerApi as SetupServerApiOriginal } from 'msw/node';
import { RequestHandler } from 'msw';
import { createStore } from '@dynamic-msw/core';
import { Setup } from '@dynamic-msw/setup';
import { AllHandlerTypes } from '@dynamic-msw/core';

export default class SetupServerApi extends SetupServerApiOriginal {
  private dynamicSetup: Setup;
  constructor(handlers: AllHandlerTypes[]) {
    super([]);
    this.dynamicSetup = new Setup(
      createStore().store,
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
