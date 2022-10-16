import openPage from 'open';
import type { Options } from 'open';
import waitOnPageResolve from 'wait-on';
import type { WaitOnOptions } from 'wait-on';

interface OpenAppPageArg {
  waitForAppPageURL: string;
  openAppURL: string;
  logOnly?: boolean;
  logMessage?: string;
  waitForOptions: WaitOnOptions;
  openAppOptions: Options;
}

export const openAppPage = async ({
  waitForAppPageURL,
  openAppURL,
  waitForOptions,
  openAppOptions,
  logOnly,
  logMessage,
}: OpenAppPageArg) =>
  waitOnPageResolve({
    ...waitForOptions,
    resources: [waitForAppPageURL, ...(waitForOptions.resources || [])],
  })
    .then(() => {
      if (logOnly) {
        console.info(`${logMessage || 'Page ready at'}: ${waitForAppPageURL}`);
      } else {
        return openPage(openAppURL, openAppOptions);
      }
    })
    .catch((err: Error) => {
      console.error('waitForAppPageURL error:');
      throw err;
    });
