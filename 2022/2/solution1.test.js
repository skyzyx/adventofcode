const path = require('node:path');
const {
  evaluate,
  loseAgainst,
  parseStrategyGuide,
  runTournament,
  runTournament2,
  score,
  tieAgainst,
  winAgainst,
} = require('./solution1');

test('ensure evaluate() works', () => {
  const theyThrowRock = 'A';
  const theyThrowPaper = 'B';
  const theyThrowScissors = 'C';

  const youThrowRock = 'X';
  const youThrowPaper = 'Y';
  const youThrowScissors = 'Z';

  const aTie = 0;
  const youWin = 1;
  const youLose = -1;

  expect(evaluate(theyThrowRock, youThrowRock)).toBe(aTie);
  expect(evaluate(theyThrowPaper, youThrowPaper)).toBe(aTie);
  expect(evaluate(theyThrowScissors, youThrowScissors)).toBe(aTie);

  expect(evaluate(theyThrowRock, youThrowPaper)).toBe(youWin);
  expect(evaluate(theyThrowPaper, youThrowScissors)).toBe(youWin);
  expect(evaluate(theyThrowScissors, youThrowRock)).toBe(youWin);

  expect(evaluate(theyThrowRock, youThrowScissors)).toBe(youLose);
  expect(evaluate(theyThrowPaper, youThrowRock)).toBe(youLose);
  expect(evaluate(theyThrowScissors, youThrowPaper)).toBe(youLose);
});

test('ensure score() works', () => {
  const theyThrowRock = 'A';
  const theyThrowPaper = 'B';
  const theyThrowScissors = 'C';

  const youThrowRock = 'X';
  const youThrowPaper = 'Y';
  const youThrowScissors = 'Z';

  const youEarnRock = 1;
  const youEarnPaper = 2;
  const youEarnScissors = 3;

  const youWin = 6;
  const aTie = 3;
  const youLose = 0;

  expect(score(theyThrowRock, youThrowRock)).toBe(youEarnRock + aTie);
  expect(score(theyThrowPaper, youThrowPaper)).toBe(youEarnPaper + aTie);
  expect(score(theyThrowScissors, youThrowScissors)).toBe(
    youEarnScissors + aTie,
  );

  expect(score(theyThrowRock, youThrowPaper)).toBe(youEarnPaper + youWin);
  expect(score(theyThrowPaper, youThrowScissors)).toBe(
    youEarnScissors + youWin,
  );
  expect(score(theyThrowScissors, youThrowRock)).toBe(youEarnRock + youWin);

  expect(score(theyThrowRock, youThrowScissors)).toBe(
    youEarnScissors + youLose,
  );
  expect(score(theyThrowPaper, youThrowRock)).toBe(youEarnRock + youLose);
  expect(score(theyThrowScissors, youThrowPaper)).toBe(youEarnPaper + youLose);
});

test('ensure parseStrategyGuide() works with example input', () => {
  let tree = parseStrategyGuide(path.resolve(__dirname, 'input.example.txt'));

  expect(tree[0][0]).toBe('A');
  expect(tree[0][1]).toBe('Y');

  expect(tree[1][0]).toBe('B');
  expect(tree[1][1]).toBe('X');

  expect(tree[2][0]).toBe('C');
  expect(tree[2][1]).toBe('Z');
});

test('play tournament', () => {
  expect(runTournament(path.resolve(__dirname, 'input.example.txt'))).toBe(15);
  expect(runTournament(path.resolve(__dirname, 'input.problem.txt'))).toBe(
    12794,
  );
});

test('competing against them', () => {
  const theyThrowRock = 'A';
  const theyThrowPaper = 'B';
  const theyThrowScissors = 'C';

  const youThrowRock = 'X';
  const youThrowPaper = 'Y';
  const youThrowScissors = 'Z';

  expect(winAgainst(theyThrowRock)).toBe(youThrowPaper);
  expect(winAgainst(theyThrowPaper)).toBe(youThrowScissors);
  expect(winAgainst(theyThrowScissors)).toBe(youThrowRock);

  expect(loseAgainst(theyThrowRock)).toBe(youThrowScissors);
  expect(loseAgainst(theyThrowPaper)).toBe(youThrowRock);
  expect(loseAgainst(theyThrowScissors)).toBe(youThrowPaper);

  expect(tieAgainst(theyThrowRock)).toBe(youThrowRock);
  expect(tieAgainst(theyThrowPaper)).toBe(youThrowPaper);
  expect(tieAgainst(theyThrowScissors)).toBe(youThrowScissors);
});

test('play tournament #2', () => {
  expect(runTournament2(path.resolve(__dirname, 'input.example.txt'))).toBe(12);
  expect(runTournament2(path.resolve(__dirname, 'input.problem.txt'))).toBe(
    14979,
  );
});
