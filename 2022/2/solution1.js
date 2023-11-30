// https://adventofcode.com/2022/day/2
const fs = require('node:fs');

// A for Rock, B for Paper, and C for Scissors
// X for Rock, Y for Paper, and Z for Scissors

function evaluate(them, you) {
  if (them === 'A' && you === 'X') return 0;
  if (them === 'B' && you === 'Y') return 0;
  if (them === 'C' && you === 'Z') return 0;
  if (them === 'A') return you === 'Y' ? 1 : -1;
  if (them === 'B') return you === 'Z' ? 1 : -1;
  if (them === 'C') return you === 'X' ? 1 : -1;
}

function winAgainst(them) {
  if (them === 'A') return 'Y';
  if (them === 'B') return 'Z';
  if (them === 'C') return 'X';
}

function loseAgainst(them) {
  if (them === 'A') return 'Z';
  if (them === 'B') return 'X';
  if (them === 'C') return 'Y';
}

function tieAgainst(them) {
  if (them === 'A') return 'X';
  if (them === 'B') return 'Y';
  if (them === 'C') return 'Z';
}

// The score for a single round is the score for the shape you selected (1 for
// Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the
// round (0 if you lost, 3 if the round was a draw, and 6 if you won).

function score(them, you) {
  let shapeScore = 0;
  switch (you) {
    case 'X':
      shapeScore = 1;
      break;
    case 'Y':
      shapeScore = 2;
      break;
    case 'Z':
      shapeScore = 3;
      break;
    default:
      break;
  }

  const result = evaluate(them, you);
  switch (result) {
    case 0:
      return shapeScore + 3;
    case 1:
      return shapeScore + 6;
    case -1:
      return shapeScore;
    default:
      break;
  }
}

// For example, suppose you were given the following strategy guide:

function parseStrategyGuide(file) {
  return fs
    .readFileSync(file, {encoding: 'utf8'})
    .trim()
    .split('\n')
    .map(e => e.split(' '));
}

// The Elves begin to set up camp on the beach. To decide whose tent gets to be
// closest to the snack storage, a giant Rock Paper Scissors tournament is
// already in progress.

function runTournament(file) {
  let tournament = parseStrategyGuide(file);
  let myScore = 0;

  for (const game of tournament) {
    myScore += score(game[0], game[1]);
  }

  return myScore;
}

// X means you need to lose, Y means you need to end the round in a draw, and Z
// means you need to win.

function runTournament2(file) {
  let tournament = parseStrategyGuide(file);
  let myScore = 0;

  for (const game of tournament) {
    let them = game[0];
    let desiredResult = game[1];

    switch (desiredResult) {
      case 'X':
        myScore += score(them, loseAgainst(them));
        break;
      case 'Y':
        myScore += score(them, tieAgainst(them));
        break;
      case 'Z':
        myScore += score(them, winAgainst(them));
        break;
      default:
        break;
    }
  }

  return myScore;
}

module.exports = {
  evaluate: evaluate,
  loseAgainst: loseAgainst,
  parseStrategyGuide: parseStrategyGuide,
  runTournament: runTournament,
  runTournament2: runTournament2,
  score: score,
  tieAgainst: tieAgainst,
  winAgainst: winAgainst,
};
