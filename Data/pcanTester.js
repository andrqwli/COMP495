const pcan = require('./pcan.js');

const ast = require("./submissionAST.json");

// tests pcan functionality
function runTest() {

    var returnObj = pcan.collectStructureStyleFacts(ast);
    console.log(returnObj);
}


runTest();