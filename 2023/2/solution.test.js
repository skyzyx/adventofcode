const path = require('node:path');
const {
  game,
  maxColor,
  parseInput,
  parseSet,
  score,
  waterPower,
} = require('./solution');

test('need at least N colors (example)', () => {
  const tree = parseInput(path.resolve(__dirname, 'input.example.txt'));

  expect(maxColor(tree[0].sets, 'blue')).toBe(6);
  expect(maxColor(tree[0].sets, 'green')).toBe(2);
  expect(maxColor(tree[0].sets, 'red')).toBe(4);

  expect(maxColor(tree[2].sets, 'blue')).toBe(6);
  expect(maxColor(tree[2].sets, 'green')).toBe(13);
  expect(maxColor(tree[2].sets, 'red')).toBe(20);

  expect(waterPower(tree)).toBe(2286);
});

test('example game', () => {
  expect(
    score(
      game(parseInput(path.resolve(__dirname, 'input.example.txt')), {
        red: 12,
        green: 13,
        blue: 14,
      }),
    ),
  ).toBe(8);
});

test('real game', () => {
  expect(
    score(
      game(parseInput(path.resolve(__dirname, 'input.problem.txt')), {
        red: 12,
        green: 13,
        blue: 14,
      }),
    ),
  ).toBe(2545);
});

test('real waterpower', () => {
  const tree = parseInput(path.resolve(__dirname, 'input.problem.txt'));

  expect(waterPower(tree)).toBe(78111);
});
