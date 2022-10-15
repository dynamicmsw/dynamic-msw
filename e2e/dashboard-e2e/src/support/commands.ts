// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getByTestId: typeof cy.get;
    containsByTestId: typeof cy.contains;
    childrenByTestId: typeof cy.children;
    findByTestId: typeof cy.find;
  }
}

const byTestIdCommands: ['get', 'children', 'find', 'contains'] = [
  'get',
  'children',
  'find',
  'contains',
];

byTestIdCommands.forEach((fnName) => {
  Cypress.Commands.add(
    `${fnName}ByTestId`,
    { prevSubject: 'optional' },
    (subject: typeof cy, selector, ...args) => {
      return (subject || cy)[fnName as any](
        `[data-testid=${selector}]`,
        ...args
      );
    }
  );
});
