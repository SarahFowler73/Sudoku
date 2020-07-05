export type Coord = [number, number];

export type FailedPath = { failedState: Puzzle };

export const isFailedPath = (
  result: FailedPath | Solution
): result is FailedPath => (result as FailedPath).failedState !== undefined;

export interface Node {
  puzzle: Puzzle;
  parent: Node | null;
  pathCost: number;
}

export interface Solution {
  solution: string;
  puzzlePath: Array<string>;
  pathCost: number;
}

export type PuzzleSet = Array<Value | null>;

export type Puzzle = Array<PuzzleSet>;

type BlockRow = number;
type BlockCol = number;

export type BlockCoords = [BlockRow, BlockCol];

export type MRV = [Coord, Array<Value>];

export type Value =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";

/**
 * Constants
 */

export const BLOCK_SIZE = 4;

export const AVAILABLE_VALUES_4X4: Array<Value> = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];
