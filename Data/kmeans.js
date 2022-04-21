const kmeans = require("ml-kmeans");

const facts = require("./arrayOfFacts.json");

function run() {
    var retObj = {};

    for (var i = 2; i < 10; i++) {
        var ans = kmeans(facts.arr, i);

        retObj[i] = ans;
    }

    var fs = require('fs');
    fs.writeFile("kmeansResult.json", JSON.stringify(retObj, null, 4), function(err, result) {
        if(err) console.log('error', err);
    })
}

run();