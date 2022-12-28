# TODOS

1. refactor types
1. create server side function that can sync storage data for server side rendering. See if this is possible with Next.js
1. disable storage saving by default.
1. add required option to select/text/number mock options
1. add option to make scenario dashboard config expandable. reconsider
1. test selected value undefined logics in dashboard
1. types: refactor namings and cleanup and export more. (createMock args are important type defs)
1. smoke test all docs
1. scan for project todos and filter important ones out
1. expose a bin script in the open-app-page module
1. add more tests
1. set number option to 0 on blur when no value is selected
1. add tests for search functionality
1. add optional option for mock options
1. add auto mock data generator option
1. add option to disable mocks unless a specific query parameter is in the url

# TODOS after releasing a stable/well tested version

1. show altered options state
1. refactor core types and helpers
1. make type checking more strict
1. add contribution docs
1. refine and add examples for more frameworks
1. remove selectedValue from mockOptions type
1. extract the open-app-page module to seperate project
1. dashboard-e2e tests log a lot of assets with the dev vite storybook. Perhaps this can be filtered.
1. figure out a way to prevent redundent changelogs from being generated
1. consider including or referencing the same setup docs as msw (the public folder part)
1. add links to source code in reference docs after the code is clean.
1. refactor docs to be more pleasant.
1. think about a valid way to visualize changes from 1 release to the previous
1. for the above, consider auto merging a succesful release with a commit message that includes a link to those changes (if possible)
1. consider seperating scenarios and mocks in the dashboard
1. add table pagination
