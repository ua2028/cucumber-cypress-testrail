/// <reference types="cypress" />

import { Given } from "cypress-cucumber-preprocessor/steps";

let asset = ''

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

Given(`I navigate existing asset page with {int} assets`, async(assetsNumber) => {
    cy.log("PURGE DB");
    cy.request("DELETE", "http://localhost:5000/removeAll/");
    for (let i = 0; i < assetsNumber; i++){
        let isin = "ISIN" + pad(i, 6);
        cy.request("POST", `http://localhost:5000/addAsset/${isin}`);
    }
    cy.visit('/assets');
});

And(`I see table`, () => {
    cy.get('[data-test="table"]')
    .as('table')
    .should('be.visible')
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


Then('I see table with {int} rows', (rowsLength) => {
    cy.get('[data-test="table-body"]', {timeout: 20000}).within(($tBody) => {
        cy.get("tr").should('have.length', rowsLength)
    })
});

Then('I see {int} result pages', (pagesResultLength) => {
    // plus 2 for previous/next
    cy.get('[data-test="page-link"]').should('have.length', pagesResultLength + 2)
});

Then('I see entries text of {string}', (entriesStr) => {
    let firstSplit = entriesStr.split("Showing ")[1].split(" ");
    let firstInt = parseInt(firstSplit[0]);
    if (firstInt==0){
        // case of "Showing 0 entries"
        cy.get('.dataTables_info', {timeout: 20000}).should('have.text', `Showing 0 entries`)

    }else{
        // case of "Showing 1 to 10 of 10 entries"
        let toInt = firstSplit[2];
        let totalResults = firstSplit[4];
        cy.get('.dataTables_info', {timeout: 20000}).should('have.text', `Showing 1 to ${toInt} of ${totalResults} entries`)
    }
});

