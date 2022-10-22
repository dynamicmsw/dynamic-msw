# @dynamic-msw/dashboard

WARNING: This library is in alpha phase and might be patched with breaking changes. It is recommended to only use this as proof of concept.

The dashboard is an optional user interface for [@dynamic-msw/core](../core/README.md). It allows you to alter dynamic mocks using an user interface. This is usefull for development/smoke testing purposes.

Dynamic Mock Service Worker (Dynamic MSW) is an extension for Mock Service Worker (MSW). It conveniently makes mocked endpoint responses dynamic and updatable.

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
