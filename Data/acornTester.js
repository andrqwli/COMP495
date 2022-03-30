const acorn = require("../MACHLEARN/acorn");
const submissionMap = require("./oneInputSubmissions.json")
const problemID = "544a3ed88afe161613542b90";

const submission = "\"use strict\";\n\nfunction myMain() {\n  var arr = [] ; \n  var total = 31; \n  for (var i=0; i<(total); i++) {\n    arr[i] = fizzbuzz(i); \n  \n  }\n  arr[0] = 0; \n  alert(arr[3]);\n  alert(arr[10]); \n  alert(arr[17]);\n  alert(arr[arr.length-1]); \n  \n}\n\n\nfunction fizzbuzz (x) {\n    if ((x%3) === 0 & (x%5) === 0) {x = \"fizzbuzz\"} \n    else if ((x%3) === 0) {x = \"fizz\"} \n    else if ((x%5) === 0) {x = \"buzz\"} \n  else {x=x}; \n  return x; \n  } \n\nmyMain();\n\n ";

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