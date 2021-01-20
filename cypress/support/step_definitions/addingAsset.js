/// <reference types="cypress" />

import { Given } from "cypress-cucumber-preprocessor/steps";

let asset = ''

Given(`I navigate add asset page`, async() => {
    cy.log("PURGE DB");
    cy.request("DELETE", "http://localhost:5000/removeAll/");
    cy.visit('/add');
});

And(`I see field to add asset`, () => {
    cy.get("#defaultFormAddAsset")
    .as('textbox')
    .should('be.visible')
});

And(`I type {string}`, (asset_name) => {
    asset = asset_name; 
    cy.get("#defaultFormAddAsset")
    .type(asset_name);
});

And(`I type existing asset {string}`, (asset_name) => {
    cy.request({
        method: "POST",
        url: `http://localhost:5000/addAsset/${asset_name}`,
        failOnStatusCode: false
    });
    asset = asset_name;
    cy.get("#defaultFormAddAsset")
        .type(asset_name);
});

And(`I click add Asset`, () => {
    cy.get('button').click();
});

Then('I see validation error message', () => {
    cy.get('@textbox')
    .should(($textbox) => {
        expect($textbox.get(0).checkValidity()).to.equal(false);
        expect($textbox.get(0).validationMessage).to.equal('Please match the requested format.');
    });
});

Then('I see error message that assets exists', async() => {
    cy.get('[data-test=modal-header]')
    .should('be.visible')
    .contains('h4', 'Asset alredy exist');
    cy.get('[data-test=modal-body]')
    .should('be.visible')
    .contains('div', 'Asset name should be unique. Assert with this name already exists')
    cy.get('[data-test=modal-footer]')
    .should('be.visible')
    .contains('button', 'Close')
    .click();
    cy.get('[data-test=modal-body]')
    .should('not.be.visible')
})

Then('I see new asset is successfully added', async() => {
    cy.get('[data-test=modal-header]')
    .should('be.visible')
    .contains('h4', 'Succssess');
    cy.get('[data-test=modal-body]')
    .should('be.visible')
    .contains('div', 'Asset '+asset+' was added to the list')
    cy.get('[data-test=modal-footer]')
    .should('be.visible')
    .contains('button', 'Close')
    .click();
    cy.get('[data-test=modal-body]')
    .should('not.be.visible')
    cy.server();
    cy.route2('**/getAssets').as('showAll');
    cy.visit('/assets');
    cy.wait('@showAll')
    cy.get('[data-test=datatable-input]')
    .type(asset)
    cy.get("[data-test=table]")
    .contains(asset)
})


