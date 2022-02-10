const problemData = require('./MACHLEARN/cco-comp110-S18/problemsArray.json');
const submissionData = require("./MACHLEARN/cco-comp110-S18/submissionsArray.json");

//console.log(problemData[2].text.replace(/<[^>]+>\n*/g, "").replace("\n", ""));
console.log(submissionData[0]);

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
                code: submission.code
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
    fs.writeFile("submissionsByProblem", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
    
}

createSubmissionMap();