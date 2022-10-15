describe('next', () => {
  beforeEach(() => cy.visit('/'));
  it('should render and update mocked data', () => {
    cy.get('[data-testid="test-mocked-data"]')
      .contains('yes')
      .then(() => {
        cy.clock();
        cy.tick(4000);
        cy.get('[data-testid="test-mocked-data"]').contains('no');
      });
  });
});
