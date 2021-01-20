// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// const fs = require('fs').promises;
// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


// afterEach((done) => {
//     cy.writeFile('./filename.txt', 'test');
//     done()
// })

// Cypress.on("test:after:run", async (test, runnable) => {
//     if (test.state === "failed") {
//         console.log("test: ",test)
//         var json = JSON.stringify(Object.keys(test));
//         // fs.writeFile('myjsonfile.json', json, 'utf8', callback);
//         await fs.writeFile('filename.txt', 'test');
//         // do something
//         let item = runnable;
//         const nameParts = [runnable.title];
//
//         // Iterate through all parents and grab the titles
//         while (item.parent) {
//             nameParts.unshift(item.parent.title);
//             item = item.parent
//         }
//
//         const fullTestName = nameParts
//             .filter(Boolean)
//             .join(' -- ');           // this is how cypress joins the test title fragments
//
//         const imageUrl = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`
//         cy.task('log', "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
//     }
// });