const problemData = require('./problemsArray.json');
const submissionData = require("./submissionsArray.json");
const oneInputProblemData = require("./oneInputProblems.json");
const submissionsByProblemData = require("./submissionsByProblem.json");


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

function createSubmissionMap() {
    let retObj = {};
    submissionData.forEach(submission => {
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

function oneInputSubmission() {
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

        if (submissionsByProblemData[problem._id.$oid] == undefined) {
            console.log(problem._id.$oid);
        } else {
            submissionsByProblemData[problem._id.$oid].forEach((submission) => {
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

    console.log(retSorted);
    const retObj = Object.fromEntries(ret);

    var fs = require('fs');
    fs.writeFile("oneInputSubmissions.json", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })

}

oneInputSubmission();