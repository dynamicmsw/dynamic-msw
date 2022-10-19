const openLastConfig = () => {
  cy.containsByTestId('scenario-title', 'example scenario');
  cy.getByTestId('configure-panel').last().children('summary').click();
};

describe('createScenario', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dashboard--primary', { timeout: 30000 })
  );
  it('should load in config from iframe and save scenario mock config when adjusted', () => {
    cy.getByTestId('dashboard-state').contains('Loading mock config...');
    openLastConfig();
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .should('not.be.checked');
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .first()
      .click();
    // TODO: CRITICAL: pretty tire but this reload messes with the e2e tests:
    // cy.reload();
    openLastConfig();
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .first()
      .should('be.checked');
  });
  it('should reset mocks when the reset mock button is pressed', () => {
    openLastConfig();
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .should('not.be.checked');
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .first()
      .click();
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .first()
      .should('be.checked');
    cy.getByTestId('reset-all-mocks-button').click();
    openLastConfig();
    cy.getByTestId('configure-panel')
      .last()
      .findByTestId('scenario-config-input')
      .first()
      .should('not.be.checked');
  });
});
