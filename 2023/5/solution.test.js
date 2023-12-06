const path = require('node:path');
const {
  findLowest,
  lookup,
  parseInput,
  parseIntoMap,
  parseIntoMap2,
  seedToLocation,
} = require('./solution');

test('seeds → soil (example)', () => {
  let map = parseIntoMap(
    parseInput(path.resolve(__dirname, 'input.example.txt')),
  );

  expect(lookup(map, 'seed_to_soil', 79)).toBe(81);
  expect(lookup(map, 'seed_to_soil', 14)).toBe(14);
  expect(lookup(map, 'seed_to_soil', 55)).toBe(57);
  expect(lookup(map, 'seed_to_soil', 13)).toBe(13);
});

test('seeds → location (example)', () => {
  let map = parseIntoMap(
    parseInput(path.resolve(__dirname, 'input.example.txt')),
  );

  expect(seedToLocation(map, 79)).toBe(82);
  expect(seedToLocation(map, 14)).toBe(43);
  expect(seedToLocation(map, 55)).toBe(86);
  expect(seedToLocation(map, 13)).toBe(35);
});

test('find closest location, part 1 (example)', () => {
  let map = parseIntoMap(
    parseInput(path.resolve(__dirname, 'input.example.txt')),
  );

  expect(findLowest(map)).toBe(35);
});

test('find closest location, part 1 (real)', () => {
  let map = parseIntoMap(
    parseInput(path.resolve(__dirname, 'input.problem.txt')),
  );

  expect(findLowest(map)).toBe(322500873);
});

test('find closest location, part 2 (example)', () => {
  let map = parseIntoMap2(
    parseInput(path.resolve(__dirname, 'input.example.txt')),
  );

  expect(findLowest(map)).toBe(46);
});

test('find closest location, part 2 (real)', () => {
  let map = parseIntoMap2(
    parseInput(path.resolve(__dirname, 'input.problem.txt')),
  );

  expect(findLowest(map)).toBe(46);
});
