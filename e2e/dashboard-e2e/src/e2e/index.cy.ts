const openConfig = () => {
  cy.containsByTestId('scenario-title', 'example');
  cy.getByTestId('configure-panel').first().children('summary').click();
};

describe('Dynamic MSW Dashboard', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dashboard--primary', { timeout: 30000 })
  );

  it('should load in config from iframe and save mock config when adjusted', () => {
    cy.getByTestId('dashboard-state').contains('Loading mock config...');
    openConfig();
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .should('be.checked');
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .click();
    cy.reload();
    openConfig();
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .should('not.be.checked');
  });
  it('should reset mocks when the reset mock button is pressed', () => {
    openConfig();
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .should('be.checked');
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .click();
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .should('not.be.checked');
    cy.getByTestId('reset-all-mocks-button').click();
    cy.getByTestId('configure-panel')
      .first()
      .findByTestId('scenario-config-input')
      .should('be.checked');
  });
});
