# TODOS

1. Add combineMocks helper so a user can re-use mocks in different scenarios.
   A user should be able to have the same endpoint mocked/defined multiple times but used in different scenarios.
   Add a bootstrap scenario button which will make identical mocks in different scenarios inactive.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise.
1. add query param to dashboard to reset local storage (this can be useful if you wanna clear the storage on server start)
   Package.json example:
1. skip nx cache on main branch qa check workflow ${GITHUB_REF##\*/} to catch errors hidden by cache. consider using this on releases only to consume less ci minutes or make it a periodically manual workflow run.

   ```
   "serve": "npm-run-all serve:*",
   "serve:next": "next dev",
   "serve:open-browser": "wait-on http://localhost:3000/mock-server/index.html && open http://localhost:3000/mock-server/index.html?resetStorage=true",
   ```

   Perhaps it's also nice to add a helper module for this to do this in server startup code like webpack config or nextjs config etc.:
   https://www.npmjs.com/package/wait-on
   https://www.npmjs.com/package/open
