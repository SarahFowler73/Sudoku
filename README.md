# Depth Limited Search for Uninformed Agent

### CSC 479 Assignment 1

### Sarah Fowler

This solution to the vacuum world was built using Typescript and Node. In a 2x2 room, with the vacuum starting in the bottom left square (0,0), and searching actions to a max depth of 10.

See answers to questions below.

# Set Up

## Required Pre-install

[Node.js and npm](https://nodejs.org/en/download/)

## Install Packages

```
npm install
```

## Run the depth-limited search in the terminal

```
npm start
```

# Questions:

1. _What is the total possible size of the agent’s search space? In other words, assuming the agent searches through the entire search space to a depth limit of 10, how many nodes will the search tree have? Include the initial state node in your answer. Also, be sure to count repeated actions separately; i.e., each “Suck” node is counted as a separate node._

 The number of nodes in the search tree can be derived by the formula for nodes in k-ary trees: `(k (h + 1) - 1) / (k - 1)`. Since there are 5 branches from each node `(k = 5)` and the max depth is 10 `(h = 10)`, would be `(5 (10 + 1) - 1) / (5 - 1) = 2441406` There are 2441406 nodes in the total tree.

2. _Assuming the agent begins the depth-limited search given the initial state shown in Figure 1, and uses a depth limit of 10, will the agent find a sequence of actions that will lead it to the goal state? If so, state how many actions will be in the solution. If not, explain why not. (Note: you may use the result you obtain from Part 2 to help you answer this question.)_

 Since the vacuum searches depth-first, and always considers the same action first, the same action will be performed multiple times uselessly on the left-most branch (in this case, the vacuum will try to "suck" 10 times before it tries any other actions). Since the first solution found (not the most optimal solution) is returned, many of these unnecessary actions are included in the preorder traversal of the tree. This means that it will take `11` actions to find a solution.

 The optimal `MAX_DEPTH` can be derived based on the size of the room (number of squares) you're searching. Since you always "Suck" first, you would subsequently need to alter moving in some direction and sucking in that new square. `S + (M + S) * (numSquares - 1)` where S and M are suck and move costs `1`. So to clean a 2x2 room (4 squares), you need a depth limit of `1 + 2 * (4 - 1) = 7`. In the `traverse.ts` file, if you cbange the `MAX_DEPTH` to 7, you'll see a more direct path to the solution (8 actions), and at `MAX_DEPTH` 6, no solution can be found.

3. _If the agent were solving a 4x4 instance of the Vacuum World, how would that affect the size of the agent’s search space?_

 If the size of the vacuum world increased to 4x4, the same actions would be available to the agent, namely: suck, north, south, east, and west. That would mean that if the search `MAX_DEPTH` remained the same, the search space would remain the same size, however, as discussed in question 2, the same `MAX_DEPTH` could be insufficient. There would now be 16 squares in the room, meaning `1 + 2 * (16 - 1) = 31`, so with the current search space, a solution could not be found. At a `MAX_DEPTH` of 31, the depth-first search would waste even more time searching through impossible solutions, and a breadth-first search would probably be more efficient in discovering a solution.
