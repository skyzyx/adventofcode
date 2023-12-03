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

function parseSet(line) {
  return line.map(set => {
    let g = {};

    set.split(', ').forEach(c => {
      let m = new RegExp(/(?<count>\d+)\s(?<color>\w+)/gim).exec(c);
      g[m.groups.color] = parseInt(m.groups.count, 10);
    });

    return g;
  });
}

function maxColor(sets, color) {
  return Math.max(...sets.map(set => set[color] || 0));
}

function game(tree, bag) {
  return tree.filter(game => {
    for (const set of game.sets) {
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
  return games.reduce((a, g) => a + g.game, 0);
}

function waterPower(games) {
  return games.reduce(
    (a, g) =>
      a +
      maxColor(g.sets, 'blue') *
        maxColor(g.sets, 'green') *
        maxColor(g.sets, 'red'),
    0,
  );
}

module.exports = {
  game: game,
  maxColor: maxColor,
  parseInput: parseInput,
  parseSet: parseSet,
  score: score,
  waterPower: waterPower,
};
