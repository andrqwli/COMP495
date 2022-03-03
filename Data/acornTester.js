const acorn = require("../MACHLEARN/acorn");
const submissionMap = require("./oneInputSubmissions.json")
const problemID = "544a3ed88afe161613542b90";

const submission = "function myMain() {\n  var x = 1;\n  var arr = [0,];\n  for (x; x<31; x++){\n    if (((x%3) === 0) && ((x%5) === 0)) {\n      arr[x] = \"fizzbuzz\";\n      continue;\n    }\n    if ((x%3) === 0) {\n      arr[x] = \"fizz\";\n      continue;\n    }\n    if ((x%5) === 0) {\n      arr[x] = \"buzz\";\n      continue;\n    }\n    else arr[x] = x;\n  }\n  alert(arr[3]);\n  alert(arr[10]);\n  alert(arr[17]);\n  alert(arr[30]);\n}\nmyMain();";

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