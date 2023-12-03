const path = require('node:path');
const {
  checkAdjacency,
  findGearRatio,
  findSymbolList,
  generateLookupTable,
  getNumberAt,
  isDigit,
  isSymbol,
  parseInput,
  sumPartNumbersBySymbol,
} = require('./solution');

test('identity digits', () => {
  expect(isDigit('*')).toBe(false);
  expect(isDigit('#')).toBe(false);
  expect(isDigit('+')).toBe(false);
  expect(isDigit('$')).toBe(false);
  expect(isDigit('.')).toBe(false);
  expect(isDigit('0')).toBe(true);
  expect(isDigit('1')).toBe(true);
  expect(isDigit('2')).toBe(true);
  expect(isDigit('3')).toBe(true);
  expect(isDigit('4')).toBe(true);
  expect(isDigit('5')).toBe(true);
  expect(isDigit('6')).toBe(true);
  expect(isDigit('7')).toBe(true);
  expect(isDigit('8')).toBe(true);
  expect(isDigit('9')).toBe(true);
});

test('identity symbols', () => {
  expect(isSymbol('*')).toBe(true);
  expect(isSymbol('#')).toBe(true);
  expect(isSymbol('+')).toBe(true);
  expect(isSymbol('$')).toBe(true);
  expect(isSymbol('.')).toBe(false);
  expect(isSymbol('0')).toBe(false);
  expect(isSymbol('1')).toBe(false);
  expect(isSymbol('2')).toBe(false);
  expect(isSymbol('3')).toBe(false);
  expect(isSymbol('4')).toBe(false);
  expect(isSymbol('5')).toBe(false);
  expect(isSymbol('6')).toBe(false);
  expect(isSymbol('7')).toBe(false);
  expect(isSymbol('8')).toBe(false);
  expect(isSymbol('9')).toBe(false);
});

test('example matrix size', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.example.txt'));

  // 10x10 matrix
  expect(matrix.length).toBe(10);
  for (const m of matrix) {
    expect(m.length).toBe(10);
  }
});

test('real matrix size', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.problem.txt'));

  // 140x140 matrix
  expect(matrix.length).toBe(140);
  for (const m of matrix) {
    expect(m.length).toBe(140);
  }
});

test('get number at matrix location', () => {
  let matrix = generateLookupTable(
    parseInput(path.resolve(__dirname, 'input.example.txt')),
  );

  // 467..114..
  // ...*......

  expect(getNumberAt(matrix, 0, 0)).toBe(467);
  expect(getNumberAt(matrix, 1, 0)).toBe(467);
  expect(getNumberAt(matrix, 2, 0)).toBe(467);
  expect(getNumberAt(matrix, 3, 0)).toBe(NaN);
  expect(getNumberAt(matrix, 4, 0)).toBe(NaN);
  expect(getNumberAt(matrix, 5, 0)).toBe(114);
  expect(getNumberAt(matrix, 6, 0)).toBe(114);
  expect(getNumberAt(matrix, 7, 0)).toBe(114);
  expect(getNumberAt(matrix, 8, 0)).toBe(NaN);
  expect(getNumberAt(matrix, 9, 0)).toBe(NaN);

  expect(getNumberAt(matrix, 0, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 1, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 2, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 3, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 4, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 5, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 6, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 7, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 8, 1)).toBe(NaN);
  expect(getNumberAt(matrix, 9, 1)).toBe(NaN);
});

test('discover symbol locations', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.example.txt'));
  let symbolList = findSymbolList(matrix);

  expect(symbolList[0].symbol).toBe('*');
  expect(symbolList[0].column).toBe(3);
  expect(symbolList[0].row).toBe(1);

  expect(symbolList[1].symbol).toBe('#');
  expect(symbolList[1].column).toBe(6);
  expect(symbolList[1].row).toBe(3);

  expect(symbolList[2].symbol).toBe('*');
  expect(symbolList[2].column).toBe(3);
  expect(symbolList[2].row).toBe(4);

  expect(symbolList[3].symbol).toBe('+');
  expect(symbolList[3].column).toBe(5);
  expect(symbolList[3].row).toBe(5);

  expect(symbolList[4].symbol).toBe('$');
  expect(symbolList[4].column).toBe(3);
  expect(symbolList[4].row).toBe(8);

  expect(symbolList[5].symbol).toBe('*');
  expect(symbolList[5].column).toBe(5);
  expect(symbolList[5].row).toBe(8);
});

test('sum of all part numbers (example)', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.example.txt'));
  let lookupTable = generateLookupTable(matrix);
  let symbolList = findSymbolList(matrix);
  let engineSchematic = 0;

  for (const symbol of symbolList) {
    let adjacency = checkAdjacency(lookupTable, symbol);
    engineSchematic += sumPartNumbersBySymbol(adjacency);
  }

  expect(engineSchematic).toBe(4361);
});

test('sum of all part numbers (real)', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.problem.txt'));
  let lookupTable = generateLookupTable(matrix);
  let symbolList = findSymbolList(matrix);
  let engineSchematic = 0;

  for (const symbol of symbolList) {
    let adjacency = checkAdjacency(lookupTable, symbol);
    engineSchematic += sumPartNumbersBySymbol(adjacency);
  }

  expect(engineSchematic).toBe(533784);
});

test('sum of all gear ratios (example)', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.example.txt'));
  let lookupTable = generateLookupTable(matrix);
  let symbolList = findSymbolList(matrix);
  let engineSchematic = 0;

  for (const symbol of symbolList) {
    if (symbol.symbol !== '*') {
      continue;
    }

    let adjacency = checkAdjacency(lookupTable, symbol);
    engineSchematic += findGearRatio(adjacency);
  }

  expect(engineSchematic).toBe(467835);
});

test('sum of all gear ratios (real)', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.problem.txt'));
  let lookupTable = generateLookupTable(matrix);
  let symbolList = findSymbolList(matrix);
  let engineSchematic = 0;

  for (const symbol of symbolList) {
    if (symbol.symbol !== '*') {
      continue;
    }

    let adjacency = checkAdjacency(lookupTable, symbol);
    engineSchematic += findGearRatio(adjacency);
  }

  expect(engineSchematic).toBe(78826761);
});
