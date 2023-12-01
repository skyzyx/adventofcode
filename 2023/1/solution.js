// https://adventofcode.com/2023/day/1
const fs = require('node:fs');
const path = require('node:path');

function parseInput(file) {
  return fs
    .readFileSync(file, {encoding: 'utf8'})
    .trim()
    .split('\n')
    .map(e => e.replace(/[^\d]/g, ''))
    .map(e => e[0] + e[e.length - 1])
    .map(e => parseInt(e, 10))
    .reduce((a, e) => a + e);
}

function parseInput2(file) {
  return fs
    .readFileSync(file, {encoding: 'utf8'})
    .trim()
    .split('\n')
    .map(s => {
      let output = '';

      while (s.length > 0) {
        if (s.startsWith('one')) {
          output += '1';
        } else if (s.startsWith('two')) {
          output += '2';
        } else if (s.startsWith('three')) {
          output += '3';
        } else if (s.startsWith('four')) {
          output += '4';
        } else if (s.startsWith('five')) {
          output += '5';
        } else if (s.startsWith('six')) {
          output += '6';
        } else if (s.startsWith('seven')) {
          output += '7';
        } else if (s.startsWith('eight')) {
          output += '8';
        } else if (s.startsWith('nine')) {
          output += '9';
        } else {
          output += s[0];
        }

        s = s.substring(1);
      }

      return output;
    })
    .map(e => e.replace(/[^\d]/g, ''))
    .map(e => e[0] + e[e.length - 1])
    .map(e => parseInt(e, 10))
    .reduce((a, e) => a + e);
}

module.exports = {
  parseInput: parseInput,
  parseInput2: parseInput2,
};
