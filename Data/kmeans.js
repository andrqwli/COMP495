const kmeans = require("ml-kmeans");

const facts = require("./arrayOfFacts.json");

// calls kmeans() on the factArr with 2 through 9 clusters and outputs to the kmeanResult.json file
// run in console with {node kmeans.js} from the Data directory

function run() {
    var retObj = {};

    for (var i = 2; i < 10; i++) {
        var ans = kmeans(facts.factArr, i);

        retObj[i] = ans;
    }

    var fs = require('fs');
    fs.writeFile("kmeansResult.json", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
}

run();