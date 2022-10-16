import openPage from 'open';
import type { Options } from 'open';
import waitOnPageResolve from 'wait-on';
import type { WaitOnOptions } from 'wait-on';

interface OpenAppPageArg {
  waitForAppPageURL: string;
  openAppURL: string;
  waitForOptions: WaitOnOptions;
  openAppOptions: Options;
}

export const openAppPage = async ({
  waitForAppPageURL,
  openAppURL,
  waitForOptions,
  openAppOptions,
}: OpenAppPageArg) =>
  waitOnPageResolve({
    ...waitForOptions,
    resources: [waitForAppPageURL, ...(waitForOptions.resources || [])],
  })
    .then(() => openPage(openAppURL, openAppOptions))
    .catch((err: Error) => {
      console.error('waitForAppPageURL error:');
      throw err;
    });
