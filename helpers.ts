import {
  Puzzle,
  PuzzleSet,
  BlockCoords,
  Coord,
  AVAILABLE_VALUES_4X4,
  BLOCK_SIZE,
  MRV,
  Value,
} from "./types";

/**
 *
 * Define Constraints
 */

export const filterNull = <T>(data: Array<T | null>): Array<T> =>
  data.filter((d) => d !== null);

// The filled items in the squares are all different
const allDifferent = (data: PuzzleSet) => {
  const filledInData = filterNull(data);
  return filledInData.length === new Set(filledInData).size;
};

// The items in the squares do not have any nulls left
const allFilled = (data: PuzzleSet) => {
  return data.indexOf(null) === -1;
};

// The items in the squares fulfill both predicates
const satisfiesConstraints = (data: PuzzleSet) =>
  allFilled(data) && allDifferent(data);

/**
 *
 * Extract Puzzle Sets
 */

// Given a row index, extract those elements from the puzzle
const getRow = (puzzle: Puzzle, rowIdx: number): PuzzleSet => puzzle[rowIdx];

// Given a column index, extract those elements from the puzzle
const getCol = (puzzle: Puzzle, colIdx: number): PuzzleSet =>
  puzzle.map((row) => row[colIdx]);

// Given block coordinates, extract all elements in the block from the puzzle
const getBlock = (puzzle: Puzzle, blockCoords: BlockCoords): PuzzleSet => {
  const rowStart = blockCoords[0] * BLOCK_SIZE;
  const rowEnd = rowStart + BLOCK_SIZE;

  const colStart = blockCoords[1] * BLOCK_SIZE;
  const colEnd = colStart + BLOCK_SIZE;

  return puzzle
    .slice(rowStart, rowEnd)
    .map((row) => row.slice(colStart, colEnd))
    .flat();
};

// Given a cell's coordinates, return the block's coordinates it belongs to
const getBlockCoords = (cellCoords: Coord): BlockCoords => [
  Math.floor(cellCoords[0] / BLOCK_SIZE),
  Math.floor(cellCoords[1] / BLOCK_SIZE),
];

/**
 *
 * Insert new values, and confirm they satisfy constraints
 */

const insertAt = <T>(value: T, idx: number, arr: Array<T>): Array<T> => [
  ...arr.slice(0, idx),
  value,
  ...arr.slice(idx + 1),
];

// Insert a value into a puzzle at particular coordinates; return a new puzzle
export const insertValue = (
  value: Value,
  cellCoords: Coord,
  puzzle: Puzzle
): Puzzle =>
  insertAt(
    insertAt(value, cellCoords[1], puzzle[cellCoords[0]]),
    cellCoords[0],
    puzzle
  );

// Check entire puzzle for completion
export const checkPuzzle = (puzzle: Puzzle) => {
  for (let i = 0; i < puzzle.length; i++) {
    if (
      !satisfiesConstraints(getRow(puzzle, i)) ||
      !satisfiesConstraints(getCol(puzzle, i))
    ) {
      return false;
    }
  }

  for (let i = 0; i < BLOCK_SIZE; i++) {
    for (let j = 0; j < BLOCK_SIZE; j++) {
      if (!satisfiesConstraints(getBlock(puzzle, [i, j]))) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Helpers to get remaining values for a cell
 */

// Helper to take the difference between two vectors
const diff = <T>(arr1: Array<T>, arr2: Array<T>): Array<T> =>
  arr1.filter((x) => !arr2.includes(x));

// Given the values in a row, column, and block for any cell, get the remaining values that can be filled in
const getValueOptions = (
  row: PuzzleSet,
  col: PuzzleSet,
  block: PuzzleSet
): Array<Value> =>
  diff<Value>(
    AVAILABLE_VALUES_4X4,
    [row, col, block]
      .map<Array<Value>>((set) => filterNull<Value>(set))
      .flat()
  );

export const getCellOptions = (
  cellCoords: Coord,
  puzzle: Puzzle
): Array<Value> => {
  const cellRow = getRow(puzzle, cellCoords[0]);
  const cellCol = getCol(puzzle, cellCoords[1]);
  const cellBlock = getBlock(puzzle, getBlockCoords(cellCoords));

  return getValueOptions(cellRow, cellCol, cellBlock);
};

export const getMRV = (blankCoords: Array<Coord>, puzzle: Puzzle): MRV =>
  blankCoords.reduce<MRV>(
    (mrv, coord) => {
      const opts = getCellOptions(coord, puzzle);
      return opts.length < mrv[1].length ? [coord, opts] : mrv;
    },
    [
      [-1, -1],
      [...AVAILABLE_VALUES_4X4, null],
    ]
  );
