// https://adventofcode.com/2023/day/3
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
      let re = new RegExp(
        /^card\s+(?<card>\d+):\s(?<wins>.+?)\s\|\s(?<have>.+?)$/gim,
      ).exec(e);
      return {
        card: Number(re.groups.card),
        wins: sift(re.groups.wins),
        have: sift(re.groups.have),
      };
    })
    .map(e => {
      return {
        card: e.card,
        winningValues: intersection(e.wins, e.have),
      };
    });
}

function intersection(a, b) {
  return a.filter(e => b.includes(e));
}

function sift(o) {
  return o
    .trim()
    .split(' ')
    .filter(e => !!e.length)
    .map(Number)
    .sort();
}

function countPoints(o) {
  return o
    .map(e => {
      return {
        card: e.card,
        winningValues: e.winningValues,
        points: (e => {
          if (e.winningValues.length - 1 < 0) {
            return 0;
          }
          return Math.pow(2, e.winningValues.length - 1);
        })(e),
      };
    })
    .reduce((a, e) => a + e.points, 0);
}

function countCards(cards) {
  for (let i = 0; i < cards.length; i++) {
    let winningValuesLength = cards[i].card + cards[i].winningValues.length;

    for (let j = cards[i].card; j < winningValuesLength; j++) {
      let matchingCard = cards.find(e => e.card === j + 1);
      cards.push(matchingCard);
    }
  }

  let counter = {};

  for (const card of cards) {
    if (!counter['card' + card.card]) {
      counter['card' + card.card] = 0;
    }

    counter['card' + card.card] += 1;
  }

  return Object.values(counter).reduce((a, e) => a + e, 0);
}

module.exports = {
  countCards: countCards,
  countPoints: countPoints,
  intersection: intersection,
  parseInput: parseInput,
};
