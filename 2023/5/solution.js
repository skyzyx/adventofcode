// https://adventofcode.com/2023/day/3
const fs = require('node:fs');
const path = require('node:path');

function parseInput(file) {
  return fs
    .readFileSync(path.resolve(__dirname, file), {
      encoding: 'utf8',
    })
    .trim()
    .split('\n\n');
}

function parseIntoMap(a) {
  let o = {
    seeds: a[0].split(': ')[1].split(' '),
    translations: {},
  };

  for (let i = 1; i < a.length; i++) {
    let line = a[i].split(':');
    let key = line[0].split(' ')[0].replaceAll('-', '_');
    o.translations[key] = line[1]
      .trim()
      .split('\n')
      .map(e => {
        let segments = e.split(' ');
        return {
          destStart: Number(segments[0]),
          sourceStart: Number(segments[1]),
          length: Number(segments[2]),
        };
      });
  }

  return o;
}

function parseIntoMap2(a) {
  let o = {
    ranges: a[0].split(': ')[1].split(' '),
    translations: {},
  };

  for (let i = 1; i < a.length; i++) {
    let line = a[i].split(':');
    let key = line[0].split(' ')[0].replaceAll('-', '_');
    o.translations[key] = line[1]
      .trim()
      .split('\n')
      .map(e => {
        let segments = e.split(' ');
        return {
          destStart: Number(segments[0]),
          sourceStart: Number(segments[1]),
          length: Number(segments[2]),
        };
      });
  }

  let ranges = o.ranges;
  let lastValue = 999999999999999;
  let progress = 0;

  console.time();

  while (ranges.length > 0) {
    let start = ranges.shift();
    let length = ranges.shift();

    for (const seed of range(Number(start), Number(length))) {
      lastValue = Math.min(lastValue, seedToLocation(o, seed));
      progress++;

      if (progress % 10_000_000 === 0) {
        console.timeLog();
      }
    }
  }

  console.timeEnd();
  console.log(`${progress} seeds processed`);

  return lastValue;
}

function* range(s, l) {
  for (var i = s; i < s + l; i++) {
    yield i;
  }
}

function lookup(map, translation, sourceValue) {
  let capture = NaN;
  map.translations[translation].forEach(e => {
    if (
      sourceValue >= e.sourceStart &&
      sourceValue <= e.sourceStart - 1 + e.length
    ) {
      capture = sourceValue + (e.destStart - e.sourceStart);
    }
  });

  if (isNaN(capture)) {
    return sourceValue;
  }

  return capture;
}

function seedToLocation(map, sourceValue) {
  let destValue = sourceValue;

  for (const [translation, mapping] of Object.entries(map.translations)) {
    destValue = lookup(map, translation, destValue);
  }

  return destValue;
}

function findLowest(map) {
  return Math.min(...map.seeds.map(Number).map(e => seedToLocation(map, e)));
}

module.exports = {
  findLowest: findLowest,
  lookup: lookup,
  parseInput: parseInput,
  parseIntoMap: parseIntoMap,
  parseIntoMap2: parseIntoMap2,
  seedToLocation: seedToLocation,
};

let map = parseIntoMap2(
  parseInput(path.resolve(__dirname, 'input.problem.txt')),
);

console.log(map);
