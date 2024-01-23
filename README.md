An quick node.js implementation of the game of Pig on the terminal.

Uses the libraries enquirer (for prompts) and chalk (for styled terminal output).

## How to read this code (for new programmers)

This code makes use of functions which return JavaScript promises, and uses async/await syntax.  It is suggested you have some understanding of both of those as a pre-requisite.

Start reading in [src/main.js](src/main.js).

Celebrate if you understand that much and descend into other files only as much as you care to!

The next most important function to study would likely be [playOneTurn](https://github.com/nbogie/pig-cli/blob/d6b73b9ba477bffd81280c2d0b5bc429fbe3c803/src/support.js#L21) in [src/support.js](src/support.js).

The JSDoc type definitions in [src/types.js](src/types.js) will help you understand the references to Player, Scores, and TurnOutcome.

Retreat where necessary and re-celebrate understanding the top level code!
