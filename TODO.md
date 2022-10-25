# TODOS

1. add docs
1. add package.json example for open-app-page implementation and consider exposing it as a .bin script
1. types: refactor namings and cleanup and export more. (createMock args are important type defs)
1. add more tests
1. consider making scenarios updatable
1. add redirect to 404 page for production environments when accessing the dashboard.
1. add open-app-page module example and include resetMocks query param to it
1. improve styling of form components
1. scan for project todos and filter important ones out
1. add contribution docs
1. remove semver hardcoded patch version from workflows

# TODOS after releasing a stable/well tested version

1. make type checking more strict
1. refine and add examples for more frameworks
1. refactor core types and helpers
1. remove selectedValue from mockOptions type
1. simplify createScenario. I believe the initial state mutation can be simplified.
1. extract the open-app-page module to seperate project
1. dashboard-e2e tests log a lot of assets with the dev vite storybook. Perhaps this can be filtered.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise. Reconsider though.
1. auto remove unwanted changelog files after releases. reconsider though.
1. consider including or referencing the same setup docs as msw (the public folder part)
1. release actions seem to not use caching. Double check e2e cache
1. does rebase and merge really not change commit hashes in github?
