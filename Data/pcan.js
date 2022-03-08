

//------------------------------------------------------------------------
//
//  This JavaScript code implements an API for AST analysis
//    the analysis is intended for unsupervised ML techniques 
//    to give more focused and specific feedback for problems and 
//    exercises in an intro programming class
//
//  We use the Acorn parser to generate an AST 
//    The AST is a JSON object, in Mozilla SpiderMonkey format
//
//  To adapt this API to another language you will have to
//   -- get an AST for the target language in SpiderMonkey format 
//   -- rewrite the code bodies
//   -- or write adapter functions
//
//  David Stotts, 2/22/2022
//  Andrew Li: andrqwli@live.unc.edu in 2/22/2022 
//
//------------------------------------------------------------------------

const walk = require("acorn-walk");

// global "package" name is pcan

var pcan = (function () {

//------------------------------------------------------------------------
//   - traverse the AST and collect all the interesting facts
//   - store facts in an object and return the object
//   - data object will be sent to the server for analysis/grading
//------------------------------------------------------------------------

    function collectStructureStyleFacts(ast) {
        
        var dObj = {
            nFLInit: numForLoopsInitializations(ast),
            nFLVarInit: numForLoopsVarInitializations(ast),
            nFLIncS: numForLoopIncrementStatements(ast),
            nAccInit: numAccumulatorInitializations(ast),
            nAS: numAlertStatements(ast),

            /****************************************/
            /* FIZZBUZZ array specific facts        */
            /* problem ID: 544a3ed88afe161613542b90 */
            /****************************************/

            conFLVarIdent: consistentLoopVariableIdentifier(ast).isConsistent,
            cFLBounds: correctForLoopBounds(ast),
            nFLVarAsIB: numForLoopVarAssignmentInBlock(ast),
            
        }

        return dObj;
    }

    function numForLoopsInitializations(ast) {
        var count = 0;
        walk.full(ast, node => {
            if (node.type == "ForStatement") {
                count++;
            }
        })
        return count;
    }

    function numForLoopsVarInitializations(ast) {
        var count = 0;
        walk.full(ast, node => {
            if (node.type == "ForStatement") {
                if (node.init.type == "VariableDeclaration") {
                    if (node.init.declarations.length == 1) {
                        if (node.init.declarations[0].hasOwnProperty("init")) {
                            count++;
                        }
                    }
                }
            }
        })

        return count;
    }

    function numForLoopIncrementStatements(ast) {
        var count = 0;
        walk.full(ast, node => {
            if(node.type == "ForStatement") {
                if (node.hasOwnProperty("update") && node.update.type == "UpdateExpression") {
                    count++;
                }
            }
        })

        return count;
    }

    function numAccumulatorInitializations(ast) {
        var count = 0;
        var identifiers = [];
        walk.full(ast, node => {
            if(node.type == "WhileStatement") {
                if (node.test.type == "BinaryExpression") {
                    if (node.test.type.left != undefined) {
                        if (node.test.type.left.type == "Identifier") {
                            identifiers.push(node.test.left.name);
                        }
                    }
                }
            }
        })

        identifiers.forEach(identifier => {
            walk.full(ast, node => {
                if (node.type == "VariableDeclaration") {
                    node.declarations.forEach(dec => {
                        if (dec.type == "VariableDeclarator") {
                            if (dec.id.name == identifier.name) {
                                count++;
                            }
                        }
                    })
                }
            })
        })

        return count;
    }

    function numAlertStatements(ast) {
        var count = 0;
        walk.full(ast, node => {
            if (node.type == "ExpressionStatement") {
                if (node.expression.type == "CallExpression") {
                    if (node.expression.callee.name == "alert") {
                        count++;
                    }
                }
            }
        })
        return count;
    }

    /**************************************************/
    /* FIZZBUZZ array specific facts                  */
    /* problem ID: 544a3ed88afe161613542b90           */
    /**************************************************/

    function consistentLoopVariableIdentifier(ast) {
        var identifier = "";

        walk.full(ast, node => {
            if (node.type == "ForStatement") {
                // check for variable declaration and store identifier value
                if (node.init.type == "VariableDeclaration") {
                    if (node.init.declarations[0].type == "VariableDeclarator") {
                        if (node.init.declarations[0].id.type == "Identifier") {
                            identifier = node.init.declarations[0].id.name;
                        }
                    }
                } else if (node.init.type == "Identifier") {
                    identifier = node.init.name;
                } else if (node.init.type == "AssignmentExpression") {
                    if (node.init.left.type == "Identifier") {
                        identifier = node.init.left.name;
                    }
                }

                // check for test to include identifier
                if (node.test.type == "BinaryExpression" && identifier != "") {
                    if (node.test.left.type != "Identifer" || node.test.left.name != indentifier) {
                        return false;
                    }
                } else { return false; }

                // check for update to include identifier
                if (node.update.type == "UpdateExpression" && identifier != "") {
                    if (node.update.argument.type != "Identifier" || node.update.argument.name != identifier) {
                        return false;
                    }
                } else { return false; }
            }
        })

        return {
            isConsistent: identifier != "",
            value: identifier,
        };
    }

    function correctForLoopBounds(ast) {
        if (!consistentLoopVariableIdentifier(ast).isConsistent) { return false; }
        
        var key = {
            "<": 31,
            "<=": 30
        }

        walk.full(ast, node => {
            if (node.type == "ForStatement") {
                if (node.test.type == "BinaryExpression") {
                    if (key[node.test.operator] != node.test.right.value) {
                        return false;
                    }
                }
            }
        })

        return true;
    }

    return {
        collectStructureStyleFacts: collectStructureStyleFacts,
        test: "test",
    }

    function numForLoopVarAssignmentInBlock(ast) {
        var count = 0;
        var loopIdentifier;
        walk.full(ast, node => {
            if (node.type == "ForStatement") {
                // check for variable declaration and store identifier value
                if (node.init.type == "VariableDeclaration") {
                    if (node.init.declarations[0].type == "VariableDeclarator") {
                        if (node.init.declarations[0].id.type == "Identifier") {
                            loopIdentifier = node.init.declarations[0].id.name;
                        }
                    }
                } else if (node.init.type == "Identifier") {
                    loopIdentifier = node.init.name;
                } else if (node.init.type == "AssignmentExpression") {
                    if (node.init.left.type == "Identifier") {
                        loopIdentifier = node.init.left.name;
                    }
                }

                //check for variable assignment inside block
                var newNode = node.body;
                walk.full(newNode, innerNode => {
                    if (innerNode.type == "AssignmentExpression") {
                        if (innerNode.left.type == "Identifier" && innerNode.left.name == "loopIdentifier") {
                            count++;
                        }
                    }
                })

            }
        })

        return count;
    }

})  // end anonymous function declaration 
(); // now run it to create and return the object with all the methods

module.exports = {
    collectStructureStyleFacts: (ast) => pcan.collectStructureStyleFacts(ast)
}