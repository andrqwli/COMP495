# COMP495

## Table of Contents

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Setup](#setup)
4. [Use](#use)

## Introduction <a name="introduction"></a>

This repository is the combination of files and data used for a COMP495 research project under Professor Stotts in the Spring of 2022.

The purpose of this project is to create a tool that gives more specific debugging feedback for student submitted source code in introductory programming courses. Submission source code is first converted into abstract syntax trees, which are then traversed and facts about each submission are collected as metadata. By using k-means unsupervised learning algorithms and the collected metadata, submissions are put into clusters that are meant to represent common bugs/errors so a manually written error-specific message can be displayed to the student. The successful implementation of this tool should lighten the load on live TAs in said programming courses.

## Overview <a name="overview"></a>

The MACHLEARN directory holds all of the raw data from past semesters. The cco-comp110-S18 directory contains bson files, of which `problem.bson` and `submission.bson` are used for problem and submission data from spring 2018. Each bson file is imported using mongo into .json arrays for use.

`acorn.js` is the abstract syntax tree parser that is run on every submission code string. `pnut.js` is a module used for AST autograding, and serves as the model for pcan.js, the module that is being used for fact collection.

The Data directory contains all the other work done for this project. pcan.js is the module that is used to collect facts (both general and problem-specific) on submission code. At the moment the only problem-specific facts are for the FizzBuzz array problem. The sub-directories in Data store various .json objects. These files are created by functions in processer.js, which essentially step-by-step reformats the output from the raw bson files into .json objects that can be iterated through and and analyzed by pcan.js.

`oneInputProblems.json` is the filtered list of all problems that only require one input argument. The .json files in the `OneInputSubmissions` directory represent every submission from each semester for each of these single input problems. Of these problems, the FizzBuzz array and For Loop Output problems were selected to be analyzed, and most of the work done was for the FizzBuzz array problem. These problems were selected based on the high number of total submissions, as well as the distribution of correct and incorrect submissions (more incorrect submissions give more diverse data for potential bugs). The `submissionsWithFacts.json` file contains the submissions for these problems as well as the attached fact metadata.

The `kmeans.js` file contains the function that runs the k-means algorithm on the submission facts, and the output is stored in `kmeansResult.json`.

## Setup <a name="setup"></a>

To set up this repository, clone it and run

```npm install```

to install the correct dependencies. The only two dependencies should be `acorn-walk` and `ml-kmeans`.

To import another data set from .bson file format, ensure that you first have a mongo db set up. Then, use mongorestore <a href="https://stackoverflow.com/questions/6770498/how-to-import-bson-file-format-on-mongodb">like so</a> in the terminal to create the db:

``` mongorestore -d [db name] -c [collection name] [path to .bson] ```

Once the collection is created, use the <a href="https://stackoverflow.com/questions/8991292/dump-mongo-collection-into-json-format">mongoexport program</a> to output the db in the specified format using tags. To create the .json files in iterable array form (used in this repository with files like `problemsArray.json`, `submissionsArray.json`, etc.) first naviage to the desired destination directory, then use: 

```mongoexport -d [db name] -c [collection name] --jsonArray -o [filename].json```

Now your .bson file should be in your destination directory in array form.

## Use <a name="use"></a>

To use the functions defined in files like `processer.js`, `acornTester.js`, `pcanTester.js`, `kmeans.js` etc., use node in console as the bottom of the files should include function calls.

For example, if I wanted to run the `createFactArray()` function from `processer.js`, I would make sure that the function call exists in the bottom of the file and run

``` ../COMP495/Data (main) $ node processer.js```

in the console.
