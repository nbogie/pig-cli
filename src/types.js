/**
 * @typedef {"p1"|"p2"} Player
 * @typedef {{p1:number, p2:number}} Scores
 * @typedef {{ outcome: "bank", newScores:Scores } | { outcome: "bust", newScores:Scores }} TurnOutcome
 */

module.exports = {
    dummyExport: null, //don't really need to export anything except to make this a module to import the types for vscode.
};
