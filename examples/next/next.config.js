const { withNx } = require('@nrwl/next/plugins/with-nx');

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  const { openAppPage } = require('../../dist/libs/open-app-page');

  openAppPage({
    openAppURL: 'http://localhost:4200/mock-dashboard',
    waitForAppPageURL: 'http://localhost:4200/mock-dashboard',
  });
}

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {},
};

module.exports = withNx(nextConfig);
