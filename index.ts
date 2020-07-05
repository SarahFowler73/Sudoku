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

console.log(process.argv0);
const processTestFile = (data: string) => {
  const splitRows = data.trim().split(/\s+/); // Split on \n, \r, or any other \s character
  const splitData = splitRows.map((row) =>
    row.split("").map((elem) => (elem === "-" ? null : elem))
  );

  return splitData as Array<Array<Value>>;
};

fs.readFile(
  "/users/sarahfowler/Downloads/Sudoku_test_puzzles/SudokuPuzzle1.txt",
  "utf8",
  (err, data) => {
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
  }
);
