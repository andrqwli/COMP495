const problemData = require('./Problems/problemsArray.json');
const submissionData = require("./SubmissionsArrays/submissionsArray.json");
const submissionf19 = require("./SubmissionsArrays/submissionf19Array.json");
const submissionm19 = require("./SubmissionsArrays/submissionm19Array.json");
const submissions20 = require("./SubmissionsArrays/submissions20Array.json");
const oneInputProblemData = require("./Problems/oneInputProblems.json");
const submissionsByProblemData = require("./SubmissionsByProblem/submissionsByProblem.json");
const submissionsf19ByProblem = require("./SubmissionsByProblem/submissionf19ByProblem.json");
const submissionsm19ByProblem = require("./SubmissionsByProblem/submissionm19ByProblem.json");
const submissionss20ByProblem = require("./SubmissionsByProblem/submissions20ByProblem.json");
const oneInputSubmissionData = require("./OneInputSubmissions/oneInputSubmissions.json");
const submissionsWithFacts = require("./submissionsWithFacts.json");
const pcan = require('./pcan');
const acorn = require('../MACHLEARN/acorn');
const fizzBuzzId = "544a3ed88afe161613542b90"; // fizzbuzz 
const forLoopId = "540e6754cd837ce46e7d899d"; // for loop output
const separator = "************************************************************************\n";


function processProblems() {
    let count = 0;
    let processedArray = [];
    problemData.forEach(problem => {
        if (problem.text != undefined) {
            processedText = problem.text.replace(/<[^>]+>\n*/g, "").replace("\n", "");
            processedArray.push({
                id: problem._id.$oid,
                text: processedText
            })
        }
        count++;
    })
    var ret = {problemCount: count, processedArray: processedArray};
    var retString = JSON.stringify(ret, null, 4);
    var fs = require('fs');
    fs.writeFile("problemsReadable.json", retString, function(err, result) {
        if(err) console.log('error', err);
    })
}

function processSubmissions() {
    let count = 0;
    let processedArray = []
    submissionData.forEach(submission => {
        if (submission._id != undefined && submission._id.$oid != null && submission.problem != null && submission.code != null) {
            processedArray.push({
                submissionId: submission._id.$oid,
                problemId: submission.problem,
                code: submission.code
            })
            count++;
        }
    })
    var ret = {submissionCount: count, processedArray: processedArray};
    var retString = JSON.stringify(ret, null, 4);
    var fs = require('fs');
    fs.writeFile("submissionsReadable.json", retString, function(err, result) {
        if(err) console.log('error', err);
    })
}

function createSubmissionMap(data) {
    let retObj = {};
    data.forEach(submission => {
        if (submission._id != undefined && submission._id.$oid != null && submission.problem != null && submission.code != null) {
            var submissionObj = {
                submissionId: submission._id.$oid,
                user: submission.user,
                code: submission.code,
                correctness: submission.value,
            }

            var problemId = submission.problem;

            if (retObj.hasOwnProperty(problemId)) {
                retObj[problemId].push(submissionObj)
            } else {               
                let temp = [];
                temp.push(submissionObj);
                retObj[problemId] = temp;
            }
        }
        //console.log(retObj);
    })
    var fs = require('fs');
    fs.writeFile("submissionsByProblem.json", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
    
}

function oneInputProblems() {
    let processedArray = [];
    let tempArr = [];

    problemData.forEach((problem) => {
        if (problem.onSubmit != undefined) {
            tempArr = problem.onSubmit.split(";");
            tempArr = tempArr[0].split("=");
            arrString = tempArr[1];

            if (arrString != undefined && arrString.charAt(arrString.length - 1) == "]" && !arrString.includes("//")) {
                arrString = arrString.trim();
                arrString = arrString.replace("\n", "");
                arrString = arrString.replace(/\s+/g, '');
                arrString = arrString.replace(",]", "]");
                var stringArr = JSON.parse(arrString);
             
                if (stringArr.length == 1) {
                    processedArray.push(problem)
                }
            }
        }
        
    })

    var ret = {count: processedArray.length, problems: processedArray};

    var fs = require('fs');
    fs.writeFile("oneInputProblems.json", JSON.stringify(ret, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
}

function oneInputSubmission(submissionDataSet) {
    let ret = new Map();
    oneInputProblemData.problems.forEach((problem) => {
        ret.set(problem._id.$oid, {
            text: problem.text.replace(/<[^>]+>\n*/g, "").replace("\n", ""),
            correct: [],
            incorrect: [],
            correctCount: 0,
            incorrectCount: 0,
            totalCount: 0,
        });

        if (submissionDataSet[problem._id.$oid] == undefined) {
            console.log(problem._id.$oid);
        } else {
            submissionDataSet[problem._id.$oid].forEach((submission) => {
                // var code = submission.code;
                // console.log(code);
                // submission.facts = pcan.collectStructureStyleFacts(acorn.parse(code));
                if (submission.correctness.correct == 1) {
                    ret.get(problem._id.$oid).correct.push(submission);
                } else {
                    ret.get(problem._id.$oid).incorrect.push(submission);
                }
            })
        }

        ret.get(problem._id.$oid).correctCount = ret.get(problem._id.$oid).correct.length;
        ret.get(problem._id.$oid).incorrectCount = ret.get(problem._id.$oid).incorrect.length;
        ret.get(problem._id.$oid).totalCount = ret.get(problem._id.$oid).correctCount + ret.get(problem._id.$oid).incorrectCount;
    })

    const retSorted = new Map([...ret.entries()].sort((a, b) => {

        return (a[1].totalCount) - (b[1].totalCount);
    }));

    const retObj = Object.fromEntries(ret);

    var fs = require('fs');
    fs.writeFile("oneInputSubmissionsm19.json", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })

}

function addFacts() {
    var problemIds = [
        "540e6754cd837ce46e7d899d", // for loop output
        "544a3ed88afe161613542b90", // fizzbuzz array
    ];

    var retObj = {};

    problemIds.forEach((id) => {
        retObj[id] = oneInputSubmissionData[id];
        retObj[id].correct.forEach(submission => {
            var AST = acorn.parse(submission.code);
            var facts = pcan.collectStructureStyleFacts(AST);
            submission.facts = facts;
            submission.factArr = Object.values(facts); 
        })
        retObj[id].incorrect.forEach(submission => {
            var AST = acorn.parse(submission.code);
            var facts = pcan.collectStructureStyleFacts(AST);
            submission.facts = facts;
            submission.factArr = Object.values(facts); 
        })
    })

    var fs = require('fs');
    fs.writeFile("submissionsWithFacts.json", JSON. stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })

}

function printSourceCode(id, isCorrect) {
    var problemObj = oneInputSubmissionData[id];
    console.log(problemObj.text);

    var submissionArray = isCorrect ? problemObj.correct : problemObj.incorrect;

    submissionArray.forEach(submission => {
        console.log(submission.submissionId, submission.user);
        console.log(submission.code);
        console.log (separator);
    });

}

function createFactArray() {
    const fizzBuzz = submissionsWithFacts[fizzBuzzId];
    var factArr = [];
    var idArr = [];
    fizzBuzz.correct.forEach(submission => {
        factArr.push(submission.factArr);
        idArr.push(submission.submissionId);
    })

    fizzBuzz.incorrect.forEach(submission => {
        factArr.push(submission.factArr);
        idArr.push(submission.submissionId);
    })

    var retObj = {
        factArr: factArr,
        idArr: idArr
    };
    var fs = require('fs');
    fs.writeFile("arrayOfFacts.json", JSON. stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
}

createFactArray();
