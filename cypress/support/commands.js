// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
let rp = require('request-promise');

// Cypress.Commands.add("actionDB", (uri, method) => {
//     try{
//         var options = {
//             method: method,
//             uri: uri,
//             simple: false,
//             headers: {
//                 "Access-Control-Allow-Origin": "*"
//             },
//             resolveWithFullResponse: true
//         };
//         return rp(options).then((res)=>{
//             return true
//         });
//     }catch(err){
//         return false
//     }
// })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
