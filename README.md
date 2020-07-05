# 16X16 Sudoku CSP Agents - Uninformed and MRV

### CSC 479 Assignment 2

### Sarah Fowler

This solution to the super Sudoku CSP was built using Typescript and Node.

Given a 16X16 text file with a Sudoku puzzle passed in by the user, two agents will solve it using a recursive search. One agent is uninformed, and will try to search left to right, top to bottom, and the other uses the Mininium Remaining Values heuristic to choose the next square to fill based on it being the most constrained.

Recursive agent code and support functions specifically for the backtrack tree is located in `agents.ts`. Helpers for testing values, extracting data, and updating the puzzle are found in `helpers.ts`. `types.ts` just defines Typescript types and constant values.

See discussion of observations below.

# Set Up

## Required Pre-install

[Node.js and npm](https://nodejs.org/en/download/)

## Install Packages

```
npm install
```

## Run the depth-limited search in the terminal

```
npm run start -- pathToSudokuTestFile.txt

```

# Discussion

Upon building and running both agents on a number of puzzles, the uninformed agent is consistently more poorly performing than the MRV agent, sometimes by thousands of attempts. In many cases, the MRV agent has the same number of attempts at assigning squares as there are empty squares at the beginning of the puzzle.

The only difference between the two agents is the method for choosing the next square, so they share the same backtracking recursive search function.

There are three base cases:

1. There are no remaining open squares and the puzzle satisfies all constraints (Solution)
2. There are no remaining open squares and the puzzle does not satisfy constraints (Failure, which should only happen if puzzle is not solvable)
3. There are no remaining viable values for a given square (Failure)

When there is at least one viable value for the chosen empty square, it will attempt to assign a value to it and recur into the rest of the puzzle, backtracking if it finds a dead end.

Adding the MRV heuristic clearly makes the agent "smarter," and eliminates much of the brute forcing, and approaches the puzzle more like a human would reason through it.
