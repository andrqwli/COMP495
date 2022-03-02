const acorn = require("../MACHLEARN/acorn");
const submissionMap = require("./oneInputSubmissions.json")
const problemID = "544a3ed88afe161613542b90";

const submission = "\"use strict\";\n\nfunction myMain() {\n  var n=1;\n  var fb =[0];\n  for (var n=1; n<=30; n++) {\n    fb[n] = fizzbuzz(n);\n  }\n  alert(fb[3]);\n  alert(fb[10]);\n  alert(fb[17]);\n  alert(fb[fb.length-1]);\n}\n\nfunction fizzbuzz ( n ) {\n  if ( (n%3===0) && (n%5===0 ) ) { return \"fizzbuzz\"; }\n  else if ( n%3===0 ) { return \"fizz\"; }\n  else if ( n%5===0 ) { return \"buzz\"; }\n  else { \n    return n;\n  }\n}\n\nmyMain();";

function parse(code) {
    var AST = acorn.parse(code);
    AST.source = submission;
    
    var fs = require('fs');
    fs.writeFile("submissionAST.json", JSON.stringify(AST, null, 4), function (err, result) {
        if (err) console.log("error, err");
    })
}
console.log(submission);
console.log(submissionMap[problemID].text);
parse(submission);