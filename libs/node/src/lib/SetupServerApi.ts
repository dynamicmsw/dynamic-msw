import { SetupServerApi as SetupServerApiOriginal } from 'msw/node';
import { RequestHandler, SharedOptions } from 'msw';
import { Setup } from '@dynamic-msw/setup';
import { AllPublicHandlerTypes } from '@dynamic-msw/core';

export default class SetupServerApi extends SetupServerApiOriginal {
  private dynamicSetup: Setup;
  constructor(handlers: AllPublicHandlerTypes[]) {
    super([]);
    this.dynamicSetup = new Setup(handlers, this.handleUpdate, false);
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
  override listen = (options?: Partial<SharedOptions>) => {
    this.dynamicSetup.start();
    super.resetHandlers(...this.dynamicSetup.initializedHandlers!);
    super.listen(options);
  };
  override close = () => {
    this.dynamicSetup.stop();
    return super.close();
  };
}
