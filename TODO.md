# TODOS

1. add docs
1. add package.json example for open-app-page implementation and consider exposing it as a .bin script
1. add more tests
1. extract the open-app-page module to seperate project
1. dashboard-e2e tests log a lot of assets with the dev vite storybook. Perhaps this can be filtered.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise. Reconsider though.
1. synced commit messages include dashboard. Alter the semver commit message to include dynamic-msw instead
1. release actions seem to not use caching. Double check e2e cache
1. remove semver hardcoded patch version from workflows
1. perhaps it's better to leave the msw setup to the user and expose an setupDynamicMocks helper
1. types: refactor namings and cleanup and export more.
1. consider making scenarios updatable
1. refine and add examples for more frameworks
1. improve styling of form components
1. add contribution docs
