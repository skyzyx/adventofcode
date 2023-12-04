const path = require('node:path');
const {
  countCards,
  countPoints,
  intersection,
  parseInput,
} = require('./solution');

test('part 1', () => {
  expect(
    countPoints(parseInput(path.resolve(__dirname, 'input.example.txt'))),
  ).toBe(13);

  expect(
    countPoints(parseInput(path.resolve(__dirname, 'input.problem.txt'))),
  ).toBe(23941);
});

test('part 2', () => {
  expect(
    countCards(parseInput(path.resolve(__dirname, 'input.example.txt'))),
  ).toBe(30);

  expect(
    countCards(parseInput(path.resolve(__dirname, 'input.problem.txt'))),
  ).toBe(5571760);
});
