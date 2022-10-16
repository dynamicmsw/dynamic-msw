import { argv } from 'process';

import { openAppPage } from './open-app-page';

const main = () =>
  openAppPage({
    openAppURL: 'http://localhost:4200/mock-server',
    waitForAppPageURL: 'http://localhost:4200/mock-server',
  });

if (argv.includes('--this-is-a-test')) {
  main();
}
