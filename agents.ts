import {
  Puzzle,
  Coord,
  Solution,
  FailedPath,
  Value,
  Node,
  isFailedPath,
} from "./types";
import {
  getCellOptions,
  checkPuzzle,
  insertValue,
  getMRV,
  filterNull,
} from "./helpers";

/**
 * Define node generation and init functions
 */
export const getAllBlankCoords = (puzzle: Puzzle): Array<Coord> =>
  filterNull(
    puzzle
      .map((row, i) =>
        row.map((cell, j) => (cell === null ? ([i, j] as Coord) : null))
      )
      .flat()
  );

export const genRootNode = (initialPuzzle: Puzzle): Node => ({
  puzzle: initialPuzzle,
  parent: null,
  pathCost: 0,
});

const genNextNode = (parent: Node, coords: Coord, value: Value): Node => ({
  puzzle: insertValue(value, coords, parent.puzzle), // New state after action applied
  parent,
  pathCost: parent.pathCost + 1,
});

const genSolution = (node: Node, solution?: Solution): Solution =>
  // If solution is absent, generate a new one from node, else extend it to add current node
  solution
    ? {
        ...solution,
        puzzlePath: [getPuzzleString(node.puzzle), ...solution.puzzlePath],
      }
    : {
        solution: getPuzzleString(node.puzzle),
        puzzlePath: [getPuzzleString(node.puzzle)],
        pathCost: node.pathCost + 1,
      };

/**
 * Define display functions
 */

const getPuzzleString = (puzzle: Puzzle): string =>
  puzzle
    .map((row) =>
      row
        .map((elem) => (elem === null ? "-" : elem))
        .join("")
        .trim()
    )
    .join("\n")
    .trim();

export const prettyPrintResult = (
  result: FailedPath | Solution,
  agentType: keyof typeof counters
) => {
  if (isFailedPath(result)) {
    return console.log(result);
  }
  console.log(
    `\n************\n${
      agentType === "uninformed" ? "Uninformed Agent" : "MRV Agent"
    }\n************\n`
  );
  console.log("Puzzle Solution:");
  console.log(result.solution);
  console.log("\nTotal Assignments: ", counters[agentType]);
  console.log("Initial Number of Unfilled Squares:");
  console.log(result.puzzlePath[0].match(/\-/g).length);
};

/**
 * Define mutable counters to keep track of number of attempted assigments
 */
const counters = {
  uninformed: 0,
  mrv: 0,
};

/**
 * Recursive Backtrack Search function that takes a node, the remaining set of unfilled coordinates in a puzzle,
 * and a function to identify the next coordinate to fill
 */
export const backtrackSearch = (
  node: Node,
  remainingCoords: Array<Coord>,
  nextSquareAndCoords: (
    unfilledCoords: Array<Coord>,
    puzzle: Puzzle
  ) => [Coord, Array<Value>, Array<Coord>],
  counterKey: keyof typeof counters
): FailedPath | Solution => {
  // Base case: no remaining nodes and puzzle is complete
  if (remainingCoords.length === 0 && checkPuzzle(node.puzzle)) {
    return genSolution(node);
  }
  // Base case: no remaining nodes and puzzle is not complete
  else if (remainingCoords.length === 0) {
    return { failedState: node.puzzle };
  }

  // Identify next square to fill, what values are available for it, and the remaining coordinates minus that one
  const [coord, valueOptions, nextCoords] = nextSquareAndCoords(
    remainingCoords,
    node.puzzle
  );

  // Base case: no options remain for cell
  if (valueOptions.length === 0) {
    return { failedState: node.puzzle };
  }

  // Assign a value option and recur into rest of the puzzle
  let result: Solution | FailedPath = { failedState: [] as Puzzle };

  for (let i = 0; i < valueOptions.length; i++) {
    if (!isFailedPath(result)) {
      break;
    }
    const nextNode = genNextNode(node, coord, valueOptions[i]);
    counters[counterKey]++;
    result = backtrackSearch(
      nextNode,
      nextCoords,
      nextSquareAndCoords,
      counterKey
    );
  }

  return isFailedPath(result) ? result : genSolution(node, result);
};

/**
 * DEFINE AGENTS
 */

// Uninformed Agent just takes the next coordinate in the unfilled list to attempt a solution
export const uninformedAgent = (initNode: Node, initCoord: Array<Coord>) => {
  const nextSquareAndCoords = (
    unfilledCoords: Array<Coord>,
    puzzle: Puzzle
  ): [Coord, Array<Value>, Array<Coord>] => {
    // Get next coordinates (next in list)
    const [headCoord, ...tailCoords] = unfilledCoords;
    const valueOptions = getCellOptions(headCoord, puzzle);
    return [headCoord, valueOptions, tailCoords];
  };
  return backtrackSearch(
    initNode,
    initCoord,
    nextSquareAndCoords,
    "uninformed"
  );
};

// MRV Agent uses the `getMRV` helper function to find the square with the least available values
export const mrvAgent = (initNode: Node, initCoord: Array<Coord>) => {
  const nextSquareAndCoords = (
    unfilledCoords: Array<Coord>,
    puzzle: Puzzle
  ): [Coord, Array<Value>, Array<Coord>] => {
    // Get next coordinates (minimum remaining values/most constrained)
    const [mrvCoord, fillOptions] = getMRV(unfilledCoords, puzzle);
    const nextCoords = unfilledCoords.filter(
      (coord) => !(coord[0] === mrvCoord[0] && coord[1] === mrvCoord[1])
    );
    return [mrvCoord, fillOptions, nextCoords];
  };
  return backtrackSearch(initNode, initCoord, nextSquareAndCoords, "mrv");
};
