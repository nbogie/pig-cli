/**
 * @typedef {"p1"|"p2"} Player either "p1" or "p2". These are the only valid values when referring to a player.
 */

/**
 * @typedef {{p1:number, p2:number}} Scores an object with two key-value pairs (p1 and p2, both with numeric values) holding the scores for the players.
 */

/**
 * @typedef {{ outcome: "bank", newScores:Scores } | { outcome: "bust", newScores:Scores }} TurnOutcome The outcome of a turn - either the player chose to bank or the player went bush.  The new scores are also contained.
 *
 * This is one of two possible shapes - either an object with an outcome of bank or an object with an outcome of bust.
 */

module.exports = {
    dummyExport: null, //don't really need to export anything except to make this a module to import the types for vscode.
};
