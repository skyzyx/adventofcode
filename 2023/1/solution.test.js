const path = require('node:path');
const {parseInput, parseInput2} = require('./solution');

test('calibration 1', () => {
  expect(parseInput(path.resolve(__dirname, 'input.example.txt'))).toBe(142);
  expect(parseInput(path.resolve(__dirname, 'input.problem.txt'))).toBe(54940);
});

test('calibration 2', () => {
  expect(parseInput2(path.resolve(__dirname, 'input.example2.txt'))).toBe(281);

  // Had to look at the subreddit. In retrospect, the instructions were probably
  // *intentionally* ambiguous. Added test cases for the edge-casey ones.
  expect(parseInput2(path.resolve(__dirname, 'input.example2.5.txt'))).toBe(
    443,
  );

  expect(parseInput2(path.resolve(__dirname, 'input.problem.txt'))).toBe(54208);
});
