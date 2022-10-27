# @dynamic-msw/dashboard

WARNING: This library is in beta phase and might be patched with breaking changes. It is recommended to only use this as proof of concept.

The dashboard is an optional user interface for [@dynamic-msw/core](https://github.com/dynamicmsw/dynamic-msw/tree/main/libs/core/README.md). It allows you to alter dynamic mocks using an user interface. This is usefull for development/smoke testing purposes.

Dynamic Mock Service Worker (Dynamic MSW) is an extension for Mock Service Worker (MSW). It conveniently makes mocked endpoint responses dynamic and updatable.

## Table of contents

- [Setup](#setup)
- [Usage](#usage)
- [Automatically open the dashboard when starting your app](#automatically-open-the-dashboard-when-starting-your-app)
- [Caveats](#caveats)
- [Framework examples](#framework-examples)

## Setup

Install the modules using yarn or npm:

- `yarn add -D @dynamic-msw/core @dynamic-msw/dashboard`
- `npm i -D @dynamic-msw/core @dynamic-msw/dashboard`

Run the `initMockServer` command (you can alter 'mock-dashboard' with any location you prefer):

- `npx initMockServer <PUBLIC_DIR>/mock-dashboard`

Replace the `<PUBLIC_DIR>` placeholder with the relative path to your server's public directory. For example, in a Create React App project this command would be:

- `npx initMockServer public/mock-dashboard`

Don't forget to initialize MSW for the browser if you didn't already:

- `npx msw init <PUBLIC_DIR> --save`

Replace the `<PUBLIC_DIR>` placeholder with the relative path to your server's public directory. For example, in a Create React App project this command would be:

- `npx msw init public/ --save`

## Usage

When starting your application, the dashboard will be available at the chosen destination in the setup step.
Using the folder as used in the setup step, this could be:
`//<HOST>:<PORT>/mock-dashboard`

For example: http://localhost:4200/mock-dashboard

## Automatically open the dashboard when starting your app

With some projects, development is based solely on dynamically mocked data. For these projects it can give
a better developer experience to open up the mock dashboard when starting your application in development mode. For convenience we added the `open-app-page` module to do this programmatically. You can also do this with a package.json for instance.

### package.json example

**Install dependencies**

Note: concurrently is just used for this example. You can use any module that allows you to run commands in parallel and adjust the start script accordingly. Or just use nx:run-commands when you are using NX.

- `yarn add -D wait-on open concurrently`
- `npm i -D wait-on open concurrently`

**Basic example for package.json scripts**

Adjust the URL's accordingly:

```json
{
  ...
  "scripts": {
    "dev": "concurrently \"npm:startApp\" \"npm:startDashboard\"",
    "devApp": "next dev",
    "devDashboard": "npm run devDashboard:waitOn && npm run devDashboard:openPage",
    "devDashboard:waitOn": "wait-on http://localhost:4200/mock-dashboard",
    "devDashboard:openPage": "open http://localhost:4200/mock-dashboard",
  }
  ...
}
```

### open-app-page module example

**Install open-app-page module using yarn or npm**

- `yarn add -D open-app-page`
- `npm i -D open-app-page`

**Programmatic example**

Add the following code to the file that will handle the startup of your development server. (e.g. webpack.config.js, next.config.js etc.) and adjust the URL's accordingly:

```js
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  const { openAppPage } = require('open-app-page');

  openAppPage({
    openAppURL: 'http://localhost:4200/mock-dashboard',
    waitForAppPageURL: 'http://localhost:4200/mock-dashboard',
  });
}
```

## Caveats

- Currently the dashboard does not allow for an option to redirect to an 404 page for production environments.
  You will have to manually ensure the index.html file is not included in your production environment.
  There are multiple ways to do this but for now the "how" is up to you to decide.

## Framework examples

[Next.JS](https://github.com/dynamicmsw/dynamic-msw/tree/main/examples/next/)

<!-- review change -->
