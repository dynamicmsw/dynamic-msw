# options to load mocked data:

TODO: choose a viable option

1. let a user load his app first which should save mock config in the storage, this can then be read out in the mock dashboard and altered based on user input. After a user navigates back to his app, it should read the mutated storage to bootstrap the mocks with
1. identical to the first option but using local storage to persist state
1. allow to load in a javascript file into the dashboard. This javascript file should populate the desired mock config into storage.
1. load specified page into iframe on the dashboard and add an onload listener

# TODOS

1. Add combineMocks helper so a user can re-use mocks in different scenarios.
   A user should be able to have the same endpoint mocked/defined multiple times but used in different scenarios.
   Add a bootstrap scenario button which will make identical mocks in different scenarios inactive.
1. Allow to disable mocks by default. Allow to disable/enable mocks in the dashboard.
   In a scenario mocks should be enabled unless specified otherwise.
1. Add reset button to dashboard
1. ensure next build job is cached properly
