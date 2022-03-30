const pcan = require('./pcan.js');
const pnut = require("../MACHLEARN/pnut");

const ast = require("./submissionAST.json");

function runTest() {

    var returnObj = pcan.collectStructureStyleFacts(ast);
    console.log(returnObj);
}

function runPnut() {
    var returnObj = pnut.collectStructureStyleFacts(ast);
    console.log(returnObj);
}

runTest();