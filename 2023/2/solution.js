// https://adventofcode.com/2023/day/2
const fs = require('node:fs');
const path = require('node:path');

function parseInput(file) {
  return fs
    .readFileSync(path.resolve(__dirname, file), {
      encoding: 'utf8',
    })
    .trim()
    .split('\n')
    .map(e => {
      let m = new RegExp(
        /^game\s(?<game>\d+):\s(?<sets>(?:(?:.+)(?:;\s)?)+?)$/gim,
      ).exec(e);
      return {
        game: parseInt(m.groups.game, 10),
        sets: parseSet(m.groups.sets.split('; ')),
      };
    });
}

function parseSet(l) {
  let o = [];

  for (const set of l) {
    let cubes = set.split(', '),
      g = {};

    for (const c of cubes) {
      let m2 = new RegExp(/(?<count>\d+)\s(?<color>\w+)/gim).exec(c);
      g[m2.groups.color] = parseInt(m2.groups.count, 10);
    }

    o.push(g);
  }

  return o;
}

function maxColor(sets, color) {
  let values = [];

  for (const set of sets) {
    if (set[color]) {
      values.push(set[color]);
    }
  }

  return Math.max(...values);
}

function waterPower(games) {
  let sum = 0;

  for (const game of games) {
    sum +=
      maxColor(game.sets, 'blue') *
      maxColor(game.sets, 'green') *
      maxColor(game.sets, 'red');
  }

  return sum;
}

function game(tree, bag) {
  return tree.filter(game => {
    let sets = game.sets;

    for (const set of sets) {
      for (const color in set) {
        if (bag[color] < set[color]) {
          return false;
        }
      }
    }

    return true;
  });
}

function score(games) {
  let score = 0;

  for (const game of games) {
    score += game.game;
  }

  return score;
}

module.exports = {
  game: game,
  maxColor: maxColor,
  parseInput: parseInput,
  parseSet: parseSet,
  score: score,
  waterPower: waterPower,
};
