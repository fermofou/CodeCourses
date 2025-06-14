describe('Example E2E Test', () => {
  it('should visit the home page', () => {
    cy.visit('/')
    cy.get('body').should('exist')
  })

  it('should have working navigation', () => {
    cy.visit('/')
    // Add your navigation tests here
    // Example:
    // cy.get('[data-testid="nav-link"]').click()
    // cy.url().should('include', '/some-route')
  })
}) 