# COMP495

## Table of Contents

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Setup](#setup)
4. [Use](#use)

### Introduction <a name="introduction"></a>

This repository is the combination of files and data used for a COMP495 research project under Professor Stotts in the Spring of 2022.

The purpose of this project is to create a tool that gives more specific debugging feedback for student submitted source code in introductory programming courses. Submission source code is first converted into abstract syntax trees, which are then traversed and facts about each submission are collected as metadata. By using k-means unsupervised learning algorithms and the collected metadata, submissions are put into clusters that are meant to represent common bugs/errors so a manually written error-specific message can be displayed to the student. The successful implementation of this tool should lighten the load on live TAs in said programming courses. 

### Overview <a name="overview"></a>

The MACHLEARN directory holds all of the raw data from past semesters. The cco-comp110-S18 directory contains bson files, of which problem.bson and submission.bson are used for problem and submission data from spring 2018. Each bson file is imported using mongo into .json arrays for use.

Acorn.js is the abstract syntax tree parser that is run on every submission code string. Pnut.js is a module used for AST autograding, and serves as the model for pcan.js, the module that is being used for fact collection.

The Data directory contains all the other work done for this project. pcan.js is the module that is used to collect facts (both general and problem-specific) on submission code. At the moment the only problem-specific facts are for the FizzBuzz array problem. The sub-directories in Data store various .json objects. These files are created by functions in processer.js, which essentially step-by-step reformats the output from the raw bson files into .json objects that can be iterated through and and analyzed by pcan.js.

### Setup <a name="setup"></a>

### Use <a name="use"></a>
