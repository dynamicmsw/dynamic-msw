import type {
  ExampleResponse,
  VariatedExampleResponse,
} from '@dynamic-msw/mock-example';

interface State {
  example: ExampleResponse;
  variatedExample: VariatedExampleResponse;
}

const initialValues = {
  someNumberOption: 345,
  someSelectOption: 'nl',
};

describe('createScenario', () => {
  after(() => {
    cy.clearLocalStorageSnapshot();
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/iframe.html?id=dashboard--primary', { timeout: 30000 });
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should not use scenario mocks when scenario is inactive', () => {
    cy.visit('/iframe.html?id=development-examplemocks--primary');
    cy.getByTestId('fetched-example-state', { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        const parsedData: State = JSON.parse(text);
        expect(parsedData.example.success).to.eq('yes');
        expect(parsedData.variatedExample.iAmBoolean).to.eq(true);
      });
  });

  it('should render all input types, save changes and initialize app with updated changes', () => {
    const updatedValues = {
      someNumberOption: 1337,
      someUndefinedOption: 'no longer undefined',
      someSelectOption: 'en',
    };

    cy.getByTestId('example-scenario-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-scenario-exampleMock-success').should(
      'not.be.checked'
    );
    cy.getByTestId('example-scenario-exampleMock-success').click();

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someBooleanOption'
    ).should('be.checked');
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someBooleanOption'
    ).click();

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someNumberOption'
    ).should('have.value', initialValues.someNumberOption);
    cy.getByTestId('example-scenario-variatedExampleMock-someNumberOption')
      .clear()
      .type(`${updatedValues.someNumberOption}`);

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someUndefinedOption'
    ).should('not.have.value');
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someUndefinedOption'
    ).type(updatedValues.someUndefinedOption);

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someSelectOption'
    ).should('have.value', initialValues.someSelectOption);
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someSelectOption'
    ).select(updatedValues.someSelectOption);

    cy.reload();

    cy.getByTestId('example-scenario-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-scenario-exampleMock-success').should('be.checked');

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someBooleanOption'
    ).should('not.be.checked');
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someNumberOption'
    ).should('have.value', updatedValues.someNumberOption);
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someUndefinedOption'
    ).should('have.value', updatedValues.someUndefinedOption);
    cy.getByTestId(
      'example-scenario-variatedExampleMock-someSelectOption'
    ).should('have.value', updatedValues.someSelectOption);

    cy.getByTestId('bootstrap-scenario').click();

    cy.visit('/iframe.html?id=development-examplemocks--primary');

    cy.getByTestId('fetched-example-state', { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        const parsedData: State = JSON.parse(text);
        expect(parsedData.example.success).to.eq('yes');
        expect(parsedData.variatedExample.iAmBoolean).to.eq(false);
        expect(parsedData.variatedExample.iAmNumber).to.eq(
          updatedValues.someNumberOption
        );
        expect(parsedData.variatedExample.iAmSelectOption).to.eq(
          updatedValues.someSelectOption
        );
        expect(parsedData.variatedExample.iHaveNoDefault).to.eq(
          updatedValues.someUndefinedOption
        );
      });
  });
  it('should reset mocks when the reset mock button is pressed', () => {
    cy.getByTestId('example-scenario-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-scenario-exampleMock-success').should('be.checked');

    cy.getByTestId('reset-all-mocks-button').click();

    cy.getByTestId('example-scenario-exampleMock-success').should(
      'not.be.checked'
    );

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someBooleanOption'
    ).should('be.checked');

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someNumberOption'
    ).should('have.value', initialValues.someNumberOption);

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someUndefinedOption'
    ).should('not.have.value');

    cy.getByTestId(
      'example-scenario-variatedExampleMock-someSelectOption'
    ).should('have.value', initialValues.someSelectOption);
  });
});
