const acorn = require("../MACHLEARN/acorn");
const submissionMap = require("./oneInputSubmissions.json")
const problemID = "544a3ed88afe161613542b90";

const submission = "\"use strict\";\n\nfunction myMain() {\n  var i;\n  var array = [];\n  var value;\n  array[0] = 0;\n  for (i=1; i<31; i++) {\n    value = i;\n    if (value%3===0 && value%5===0) {array[i] = \"fizzbuzz\"}\n    else if (value%3===0) {array[i] = \"fizz\"}\n    else if (value%5===0) {array[i] = \"buzz\"}\n    else {array[i] = value}\n  }\n  alert(array[3]);\n  alert(array[10]);\n  alert(array[17]);\n  alert(array[30]);\n}\n\nmyMain();";

function parse(code) {
    var AST = acorn.parse(code);
    AST.source = submission;
    
    var fs = require('fs');
    fs.writeFile("submissionAST.json", JSON.stringify(AST, null, 4), function (err, result) {
        if (err) console.log("error, err");
    })
}
console.log(submission);
//console.log(submissionMap[problemID].text);
parse(submission);