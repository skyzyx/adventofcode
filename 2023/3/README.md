# Post-solution thoughts

I'd never done something like this before, so when I was reading through part 1, I felt mildly intimidated (although it ended up being simpler than I'd anticipated). I knew that I'd need to break it down into a series of smaller, discrete pieces, then build-up up my understanding of the problem from there.

## Smallest pieces

Looking at the data, I realized quickly that this was a matrix. It was handy to create `isDigit()` and `isSymbol()` primitives I could rely on. Since I'm doing these in (at least) JavaScript, you can do all kinds of wacky one-liners — including stuff like:

```javascript
// * Unless it's a digit or a period, it's a symbol.
// * Rely on the truthiness of >0, and the falsiness of 0.
// * Cast to a boolean true with not-not.
function isSymbol(char) {
  return !!char.replace(/[0-9.]/, '').length;
}
```

## Matrix

Once I had my matrix (parse lines into rows, and characters into columns), I validated my assumption about each row being the same length with a simple test. The `parseInput()` function just reads the example data from disk, and parses it into not-yet-meaningful raw characters.

```javascript
test('example matrix size', () => {
  let matrix = parseInput(path.resolve(__dirname, 'input.example.txt'));

  // 10x10 matrix
  expect(matrix.length).toBe(10);
  for (const m of matrix) {
    expect(m.length).toBe(10);
  }
});
```

I wanted to figure out how to get the _number_ (instead of the _digit_) at a location. Rather than reading left and right during the _lookup stage_ to get all digits in a number, I decided to write a function which generates a lookup table up-front which parses top → bottom, left → right. As part of the generation, I replaced all of the digits with the complete numbers. So getting the number at `(0, 0)` was `467`; `(0, 1)` was `467`; `(0, 2)` was `467`; `(0, 3)` was `NaN`; and so on. I knew I’d eventually need to de-dupe, but making the values readily-available was helpful.

Reading character-by-character, left to right, top to bottom:

1. If I encounter a non-digit, append `NaN` to the row. There is nothing more to do for these.

1. If I encounter a digit, save the digit, but don't write anything to the row yet.

1. If, after I've encountered a digit (using `isDigit()` to test), I encounter a non-digit or the max length of the row, then take the digits I've collected together and backfill the row with the complete number used in-place of the individual digits, then empty the _collector_ so that I can begin again.

```javascript
[
  [467, 467, 467, NaN, NaN, 114, 114, 114, NaN, NaN], // 467..114..
  [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN], // ...*......
  [NaN, NaN,  35,  35, NaN, NaN, 633, 633, 633, NaN], // ..35..633.
  [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN], // ......#...
  [617, 617, 617, NaN, NaN, NaN, NaN, NaN, NaN, NaN], // 617*......
  [NaN, NaN, NaN, NaN, NaN, NaN, NaN,  58,  58, NaN], // .....+.58.
  [NaN, NaN, 592, 592, 592, NaN, NaN, NaN, NaN, NaN], // ..592.....
  [NaN, NaN, NaN, NaN, NaN, NaN, 755, 755, 755, NaN], // ......755.
  [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN], // ...$.*....
  [NaN, 664, 664, 664, NaN, 598, 598, 598, NaN, NaN], // .664.598..
]
```

Then I wrote am automated test which confirms that this function always returns what my eyeballs could already verify.

## Symbols

We take the raw matrix (not the lookup table we just created), and again scan over it. We compare each character (using `isSymbol()` this time), and when we encounter one, we return the literal symbol character and its position in the matix. This gives us our list of things to review (and, again, is a smaller dataset than finding all of the numbers).

```javascript
[
  { symbol: '*', row: 1, column: 3 },
  { symbol: '#', row: 3, column: 6 },
  { symbol: '*', row: 4, column: 3 },
  { symbol: '+', row: 5, column: 5 },
  { symbol: '$', row: 8, column: 3 },
  { symbol: '*', row: 8, column: 5 },
]
```

Then I wrote am automated test which confirms that this function always returns what my eyeballs could already verify.

## Adjacency

First, I wrote a quick utility function with the signature `getNumberAt(lookupTable, x, y)`. I added some very simple bounds-checking to ensure that if `x` and `y` were ever below `0`, or above the max length of the row/column, simply return `NaN`. And again, wrote tests including `(0, 0)` (among other coordinates) to ensure I (correctly) received `NaN` for every out-of-bounds coordinate (e.g., `(-1, -1)`).

I could have scanned for numbers or symbols, but I figured (based on the example) that symbols would have fewer results and fewer things to check. It’s also fewer adjacent coordinates to check (8, max) since symbols only take up a single coordinate. (This was fortuitous when I eventually read part 2.)

> [!NOTE]
> Why 8, max? We check left, right, and center, for the row above, below, and the one we're on. Which is 9. Except that center-center is our symbol, and we already know what that is. Which leaves 8. And if the symbol is on one (or more) of the edges of the matrix, that leaves fewer numbers to discover.

```plain
TL TC TR

CL .  CR

BL BC BR
```

The last piece of part 1 was ensuring that if top/bottom-center shared a number value with its left/right, that I only counted that number once _because it's the same number positioned adjacent to the symbol_. (deduping)

If we take the bottom 3 rows of the table, we have:

```plain
......755.
...$.*....
.664.598..
```

We can see that `$` is adjacent to `664`, and `*` is adjacent to both `755` and `598`. (The instructions clearly state that diagonals are _adjacent_.) So using these last two symbols:

```javascript
[
  { symbol: '$', row: 8, column: 3 },
  { symbol: '*', row: 8, column: 5 },
]
```

Our adjacency comes back as:

```javascript
[
  {
    top: { left: NaN, center: NaN, right: NaN },
    center: { left: NaN, right: NaN },
    bottom: { left: 664, center: 664, right: NaN }
  },
  {
    top: { left: NaN, center: NaN, right: 755 },
    center: { left: NaN, right: NaN },
    bottom: { left: NaN, center: 598, right: 598 }
  },
]
```

…which, visualized for `*` looks like:

```plain
NaN NaN 755

NaN  *  NaN

NaN 598 598
```

And again, write tests.

When we account for _deduping_ like we talked about above, and the fact that _numbers_ are always horizontal, never vertical, we can essentially just ensure that all results from a given _adjacent row to a symbol_ are unique (and remove the `NaN`s). This leaves us with:

```javascript
[755, 598]
```

And again, write tests.

Then we just add-up all of the matching results.

And again, write tests.

## Part 2

For part 2, my prior work in identifying symbol locations paid off.

Rather than checking all of the symbols, I just had to find the “gear” symbols (`*`), check adjacency (with de-duping), and remove `NaN`s. If there are exactly 2 numbers, multiply them, then add up each mathematical _product_.

And again, write tests.
