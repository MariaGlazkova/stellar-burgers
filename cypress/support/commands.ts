/// <reference types="cypress" />

Cypress.Commands.add('dismissDevServerOverlay', () => {
  cy.document({ log: false }).then((doc) => {
    doc.getElementById('webpack-dev-server-client-overlay')?.remove();
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      dismissDevServerOverlay: () => Chainable<void>;
    }
  }
}

export {};
