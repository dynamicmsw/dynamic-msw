import type {
  ExampleResponse,
  VariatedExampleResponse,
} from '@dynamic-msw/mock-example';

interface State {
  example: ExampleResponse;
  variatedExample: VariatedExampleResponse;
}

const initialValues = {
  someNumberOption: 123,
  someSelectOption: 'nl',
};

describe('createMock', () => {
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

  it('should render all input types, save changes and initialize app with updated changes', () => {
    const updatedValues = {
      someNumberOption: 1337,
      someUndefinedOption: 'no longer undefined',
      someSelectOption: 'en',
    };

    cy.getByTestId('example-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-success').should('be.checked');
    cy.getByTestId('example-success').click();

    cy.getByTestId('Variated-mock-options-configure').find('summary').click();

    cy.getByTestId('Variated-mock-options-someBooleanOption').should(
      'be.checked'
    );
    cy.getByTestId('Variated-mock-options-someBooleanOption').click();

    cy.getByTestId('Variated-mock-options-someNumberOption').should(
      'have.value',
      initialValues.someNumberOption
    );
    cy.getByTestId('Variated-mock-options-someNumberOption')
      .clear()
      .type(`${updatedValues.someNumberOption}`);

    cy.getByTestId('Variated-mock-options-someUndefinedOption').should(
      'not.have.value'
    );
    cy.getByTestId('Variated-mock-options-someUndefinedOption').type(
      updatedValues.someUndefinedOption
    );

    cy.getByTestId('Variated-mock-options-someSelectOption').should(
      'have.value',
      initialValues.someSelectOption
    );
    cy.getByTestId('Variated-mock-options-someSelectOption').select(
      updatedValues.someSelectOption
    );

    cy.reload();

    cy.getByTestId('example-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-success').should('not.be.checked');

    cy.getByTestId('Variated-mock-options-configure').find('summary').click();

    cy.getByTestId('Variated-mock-options-someBooleanOption').should(
      'not.be.checked'
    );
    cy.getByTestId('Variated-mock-options-someNumberOption').should(
      'have.value',
      updatedValues.someNumberOption
    );
    cy.getByTestId('Variated-mock-options-someUndefinedOption').should(
      'have.value',
      updatedValues.someUndefinedOption
    );
    cy.getByTestId('Variated-mock-options-someSelectOption').should(
      'have.value',
      updatedValues.someSelectOption
    );

    cy.visit('/iframe.html?id=development-examplemocks--primary');

    cy.getByTestId('fetched-example-state', { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        const parsedData: State = JSON.parse(text);
        expect(parsedData.example.success).to.eq('no');
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
    cy.getByTestId('example-configure', { timeout: 10000 })
      .find('summary')
      .click();

    cy.getByTestId('example-success').should('not.be.checked');

    cy.getByTestId('reset-all-mocks-button').click();

    cy.getByTestId('example-success').should('be.checked');

    cy.getByTestId('Variated-mock-options-configure').find('summary').click();

    cy.getByTestId('Variated-mock-options-someBooleanOption').should(
      'be.checked'
    );

    cy.getByTestId('Variated-mock-options-someNumberOption').should(
      'have.value',
      initialValues.someNumberOption
    );

    cy.getByTestId('Variated-mock-options-someUndefinedOption').should(
      'not.have.value'
    );

    cy.getByTestId('Variated-mock-options-someSelectOption').should(
      'have.value',
      initialValues.someSelectOption
    );
  });
});
