# TODOS

1. consider simplifying mockOptions e.g. success: {defaultValue:true} becomes success: true. Consider excluding select options so the behavior is predictable
1. remove selectedValue from mockOptions type
1. add docs
1. add package.json example for open-app-page implementation and consider exposing it as a .bin script
1. add more tests
1. extract the open-app-page module to seperate project
1. dashboard-e2e tests log a lot of assets with the dev vite storybook. Perhaps this can be filtered.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise. Reconsider though.
1. release actions seem to not use caching. Double check e2e cache
1. remove semver hardcoded patch version from workflows
1. types: refactor namings and cleanup and export more. (createMock args are important type defs)
1. consider making scenarios updatable
1. refine and add examples for more frameworks
1. improve styling of form components
1. add contribution docs
1. add proper type defs for options: [] in mockOptions
1. think about a convenient way to reset mocks on startup with or without using the dashboard. I read about a way to use session storage
   in combination with localStorage to re-use session storage across tabs. Reconsider if this is usefull for non dashboard usage.
1. add redirect to 404 page for production environments when accessing the dashboard. Maybe even the dashboard-settings.js file. Reconsider though.
1. auto remove unwanted changelog files after releases. reconsider though.
