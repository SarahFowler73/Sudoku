#!/usr/bin/env node

import { Value } from "./types";
import {
  uninformedAgent,
  genRootNode,
  mrvAgent,
  prettyPrintResult,
  getAllBlankCoords,
} from "./agents";

const fs = require("fs");

// Converts a string test file into a list of lists of values
const processTestFile = (data: string) => {
  const splitRows = data.trim().split(/\s+/); // Split on \n, \r, or any other \s character
  const splitData = splitRows.map((row) =>
    row.split("").map((elem) => (elem === "-" ? null : elem))
  );

  return splitData as Array<Array<Value>>;
};

// Reads test file from path, processes it, runs through the two agent solvers
// and prints the results
const runAgents = (path: string) =>
  fs.readFile(path, "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
    const puzzle = processTestFile(data);
    prettyPrintResult(
      uninformedAgent(genRootNode(puzzle), getAllBlankCoords(puzzle)),
      "uninformed"
    );
    prettyPrintResult(
      mrvAgent(genRootNode(puzzle), getAllBlankCoords(puzzle)),
      "mrv"
    );
  });

// Read file path from command line
const filePath = process.argv[2];

if (typeof filePath !== "string") {
  console.log("Error: Please pass the path to a test file\n");
} else if (!fs.existsSync(filePath)) {
  console.log(`Error: "${filePath}" does not exist. Please check your input\n`);
} else {
  runAgents(filePath);
}
