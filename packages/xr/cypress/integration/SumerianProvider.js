describe('SumerianProvider loadScene', function() {
  beforeEach(function() {
    cy.visit('/')
  })

  it('successfully signs in and out', function() {
    cy.get('#sumerian-scene-dom-id');  // Check for scene dom id
    cy.wait(5000); // Wait for scene to load
    cy.get('#sumerian'); // Look for sumerian scene canvas
  })
})