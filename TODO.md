# TODOS

1. consider implement easy todos before the complex ones
1. reconsider the createScenario functionality. It adds a lot of complexity. Perhaps create a draft
   to reconsider and implement a stable createMock API.
1. WIP: Add combineMocks helper so a user can re-use mocks in different scenarios.
   A user should be able to have the same endpoint mocked/defined multiple times but used in different scenarios.
   Add a bootstrap scenario button which will make identical mocks in different scenarios inactive.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise. Reconsider though.
1. add query param to dashboard to reset local storage (this can be useful if you wanna clear the storage on server start)
1. add package.json example for open-app-page implementation and consider exposing it as a .bin script
1. skip nx cache on main branch qa check workflow ${GITHUB_REF##\*/} to catch errors hidden by cache. consider using this on releases only to consume less ci minutes or make it a periodically manual workflow run.
1. ensure mock titles are uniques or show a warning
1. scenarios are getting a bit complex. decide if scenarios should be updateable for automated tests.
   As I see it now, it might be better to only use scenarios for development/dashboard purposes and use
   createMocks for updating mocks during tests.
1. try fix createScenario source code complexity.
1. right now a user has to create a function with an options arg that returns a createMock function call
   in order to update a createMock for use in a scenario.
   Decide if it's better to implement an API for this to prevent users from having to do this themself when
   they decide to re-use a createMock in a scenario. Think about the best developer experience possible
   (use the module yourself to test this).
1. add automated tests for createScenario (dashboard and core)
1. implement getPageUrl function for scenarios
1. implement bootstrap button for scenarios (the page url button should bootstrap by default)
1. add docs
