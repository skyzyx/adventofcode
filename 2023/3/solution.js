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
    .map(e => e.split(''));
}

function isDigit(char) {
  return !char.replace(/\d/, '').length;
}

function isSymbol(char) {
  return !!char.replace(/[0-9.]/, '').length;
}

function generateLookupTable(matrix) {
  let lookupTable = [];
  let matrixLength = matrix.length;

  for (let rowIdx = 0; rowIdx < matrixLength; rowIdx++) {
    let row = matrix[rowIdx];
    let rowLength = row.length;
    let columns = [];
    let digitCollector = '';

    for (let columnIdx = 0; columnIdx < rowLength; columnIdx++) {
      let column = row[columnIdx];

      if (isDigit(column)) {
        digitCollector += column;
      } else {
        if (digitCollector > 0) {
          for (let i = 0; i < digitCollector.length; i++) {
            columns.push(parseInt(digitCollector, 10));
          }

          digitCollector = '';
        }

        columns.push(NaN);
      }
    }

    if (digitCollector > 0) {
      for (let i = 0; i < digitCollector.length; i++) {
        columns.push(parseInt(digitCollector, 10));
      }
    }

    lookupTable.push(columns);
  }

  return lookupTable;
}

function getNumberAt(lookupTable, x, y) {
  if (x < 0 || y < 0) {
    return NaN;
  }

  if (y >= lookupTable.length) {
    return NaN;
  }

  if (x >= lookupTable[y].length) {
    return NaN;
  }

  return lookupTable[y][x];
}

function findSymbolList(matrix) {
  let symbolList = [];

  for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
    let row = matrix[rowIdx];

    for (let columnIdx = 0; columnIdx < row.length; columnIdx++) {
      let column = row[columnIdx];

      if (isSymbol(column)) {
        symbolList.push({
          symbol: column,
          row: rowIdx,
          column: columnIdx,
        });
      }
    }
  }

  return symbolList;
}

function checkAdjacency(lookupTable, symbol) {
  // Numbers are always horizontal, never vertical, so group into rows. If a
  // center number matches its left or right number (or both), only count the
  // number once.
  return {
    top: {
      left: getNumberAt(lookupTable, symbol.column - 1, symbol.row - 1),
      center: getNumberAt(lookupTable, symbol.column, symbol.row - 1),
      right: getNumberAt(lookupTable, symbol.column + 1, symbol.row - 1),
    },
    center: {
      left: getNumberAt(lookupTable, symbol.column - 1, symbol.row),
      // center: This is the symbol!,
      right: getNumberAt(lookupTable, symbol.column + 1, symbol.row),
    },
    bottom: {
      left: getNumberAt(lookupTable, symbol.column - 1, symbol.row + 1),
      center: getNumberAt(lookupTable, symbol.column, symbol.row + 1),
      right: getNumberAt(lookupTable, symbol.column + 1, symbol.row + 1),
    },
  };
}

function sumPartNumbersBySymbol(adjacency) {
  let sum = 0;

  for (const row of Object.values(adjacency)) {
    let uniqRowValues = [...new Set(Object.values(row))].filter(
      n => !Number.isNaN(n),
    );

    sum += uniqRowValues.reduce((a, e) => a + e, 0);
  }

  return sum;
}

function findGearRatio(adjacency) {
  let gearRatio = 0;
  let values = [];

  for (const row of Object.values(adjacency)) {
    let uniqRowValues = [...new Set(Object.values(row))].filter(
      n => !Number.isNaN(n),
    );

    values.push(uniqRowValues);
  }

  values = values.flat();

  if (values.length === 2) {
    gearRatio = values[0] * values[1];
  }

  return gearRatio;
}

module.exports = {
  checkAdjacency: checkAdjacency,
  findGearRatio: findGearRatio,
  findSymbolList: findSymbolList,
  generateLookupTable: generateLookupTable,
  getNumberAt: getNumberAt,
  isDigit: isDigit,
  isSymbol: isSymbol,
  parseInput: parseInput,
  sumPartNumbersBySymbol: sumPartNumbersBySymbol,
};
