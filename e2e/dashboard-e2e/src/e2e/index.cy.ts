const openFirstConfig = () => {
  cy.containsByTestId('scenario-title', 'example');
  cy.getByTestId('configure-panel').first().children('summary').click();
};
const openLastConfig = () => {
  cy.containsByTestId('scenario-title', 'example scenario');
  cy.getByTestId('configure-panel').last().children('summary').click();
};

describe('Dynamic MSW Dashboard', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dashboard--primary', { timeout: 30000 })
  );

  describe('createMock', () => {
    it('should load in config from iframe and save mock config when adjusted', () => {
      cy.getByTestId('dashboard-state').contains('Loading mock config...');
      openFirstConfig();
      cy.getByTestId('configure-panel')
        .first()
        .findByTestId('scenario-config-input')
        .should('be.checked');
      cy.getByTestId('configure-panel')
        .first()
        .findByTestId('scenario-config-input')
        .click();
      cy.reload();
      openFirstConfig();
      cy.getByTestId('configure-panel')
        .first()
        .findByTestId('scenario-config-input')
        .should('not.be.checked');
    });
    it('should reset mocks when the reset mock button is pressed', () => {
      openFirstConfig();
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
      openFirstConfig();
      cy.getByTestId('configure-panel')
        .first()
        .findByTestId('scenario-config-input')
        .should('be.checked');
    });
  });

  describe('createScenario', () => {
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
        .click();
      cy.reload();
      openLastConfig();
      cy.getByTestId('configure-panel')
        .last()
        .findByTestId('scenario-config-input')
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
        .click();
      cy.getByTestId('configure-panel')
        .last()
        .findByTestId('scenario-config-input')
        .should('be.checked');
      cy.getByTestId('reset-all-mocks-button').click();
      cy.getByTestId('configure-panel')
        .last()
        .findByTestId('scenario-config-input')
        .should('not.be.checked');
    });
  });
});
