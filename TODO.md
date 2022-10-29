# TODOS

1. add option to disable scenario in dashboard
1. show active scenario state (or use the disable scenario button to make it clear)
1. show altered options state
1. The reset button should not reset properly after page reload (it uses storage state). Consider adding a second button to reinitialize state.
1. For the above step, the mock server config initialize page url is pretty much required. Consider making this required.
1. consider adding an title option to scenario mocks. Right now it uses the function name, which is likely something camelCased.
1. add scenario search functionality (reorder footer buttons like reset all mocks to the top for until pagination is implemented)
1. types: refactor namings and cleanup and export more. (createMock args are important type defs)
1. add redirect to 404 page for production environments when accessing the dashboard.
1. Add option to hide/disable mocks by default. Usefull for when one only wants to display/use it in an scenario. Reconsider.
1. scan for project todos and filter important ones out
1. expose a bin script in the open-app-page module
1. add more tests
1. smoke test all docs

# TODOS after releasing a stable/well tested version

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
