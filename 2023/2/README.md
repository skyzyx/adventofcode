# Post-solution thoughts

Honestly, the most time-consuming part of this one was parsing the input data into a data structure that made for (relatively) efficient lookups.

## Parsing into a tree

I parsed the input file into a data structure which looks like this:

```javascript
[
  {
    game: 1,
    sets: [
      {blue: 3, red: 4},
      {red: 1, green: 2, blue: 6},
      {green: 2}
    ],
  },
  // …snip…
];
```

Since I'm using JavaScript, regular expressions to the rescue! I used <https://regex101.com> to help me test everything when I was writing the pattern, but I essentially used one regex to parse each line into _game number_ and _sets_, then iterated over each set with another regex to subdivide what was left.

```javascript
let matches = new RegExp(
  /^game\s(?<game>\d+):\s(?<sets>(?:(?:.+)(?:;\s)?)+?)$/gim,
).exec(line);
```

1. Used `?<name>` to name each matched grouping.
1. Used `?:` to indicate a non-matching pattern. Doesn't come back as a "match", but it's part of the matching pattern.
1. Used `+?` to specify _one or more_, but _non-greedy_.

I'd initially tried to some up with a single, _cleverest-of-them-all_ pattern, but to no avail. :(

## Finding max number of colors

JavaScript is a great language to use when you want tolerant behavior with little necessary error-checking. Also, modern JavaScript syntax had made long strides against the amount of code you have to write.

```javascript
function maxColor(sets, color) {
  return Math.max(...sets.map(set => set[color] || 0));
}
```

1. Having the `.sets` data you care about for the line you're processing, and the color you want to find the largest value for…
1. Use a `.map()` which takes an array of values, then mutates those values and returns them, resulting in a new array of mutated values.
1. These mutated values are of the color, or `0` if the color node doesn't exist in the object.
1. `...` is the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), which converts array contents into individual parameters.
1. [`Math.max()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) returns the largest value of each of the parameters.

With the following input:

```plain
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
```

…and a parsed data structure which looks like this:

```javascript
{
  game: 1,
  sets: [
    {blue: 3, red: 4},
    {red: 1, green: 2, blue: 6},
    {green: 2}
  ],
};
```

…I was able to write a validating test that looks like this:

```javascript
test('need at least N colors (example)', () => {
  const tree = parseInput(path.resolve(__dirname, 'input.example.txt'));

  expect(maxColor(tree[0].sets, 'blue')).toBe(6);
  expect(maxColor(tree[0].sets, 'green')).toBe(2);
  expect(maxColor(tree[0].sets, 'red')).toBe(4);
});

```

…where the largest values are

* blue: 6
* green: 2
* red: 4

## Defining the game

We know from the description that we only need to determine if a game result is _possible_ based on the number of cubes we know are in the bag. This means that if a result contains _more_ than the available number of cubes, the game is _not possible_. This means that _possible_ results have all colors that are all _below_ the colors of cubes in the bag.

```javascript
function game(tree, bag) {
  return tree.filter(game => {
    for (const set of game.sets) {
      for (const color in set) {
        if (bag[color] < set[color]) {
          return false;
        }
      }
    }

    return true;
  });
}
```

1. `tree` is a collection of all of the _game results_. `bag` is the set of colored cubes in the bag.
1. Iterate over the colors in the results, and the colors in the bag. If there are more colors in the result than are available in the bag, the result is not possible.
1. `.filter()` in JavaScript works similarly to `.map()` (described above), but instead of mutating the value, the callback function will return a _truthy_ or _falsey_ value. _Falsey_ values will be removed from the array; _truthy_ values will remain.

```javascript
let results = parseInput(path.resolve(__dirname, 'input.example.txt'));

console.log(
  game(results, {
    red: 12,
    green: 13,
    blue: 14,
  }),
);
```

…will return the following (simplified) results. These are the games that are _possible_.

```javascript
[
  { game: 1, sets: [ [Object], [Object], [Object] ] },
  { game: 2, sets: [ [Object], [Object], [Object] ] },
  { game: 5, sets: [ [Object], [Object] ] }
]
```

## Scoring the game

We just need to take the game numbers, and add them together.

Games `1`, `2`, and `5` equal `8`.

```javascript
function score(games) {
  return games.reduce((a, g) => a + g.game, 0);
}
```

1. This uses [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) which allows you to carry-forward the result from the previous iteration, then perform a calculation on it in the current iteration.
1. The reducer function takes two parameters: an _accumulator_ (the result of the previous calculation), and the value of the current iteration (for us, the game result). We just take the game numbers and add them together.

```javascript
let results = parseInput(path.resolve(__dirname, 'input.example.txt'));

console.log(
  score(
    game(results, {
      red: 12,
      green: 13,
      blue: 14,
    }),
  ),
);
```

## Part 2: Water power

This was a pretty simple shift from part 1, where I was able to use the lower-level functions I'd already written, and just combine them slightly differently.

```javascript
function waterPower(games) {
  return games.reduce(
    (a, g) =>
      a +
      maxColor(g.sets, 'blue') *
        maxColor(g.sets, 'green') *
        maxColor(g.sets, 'red'),
    0,
  );
}
```

1. This again uses [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), with an _accumulator_ (the result of the previous calculation), and the value of the current iteration (for us, the game result).
1. We calculate the same `maxColor()` value for each color, multiply them together, and add to the previous result.

```javascript
let results = parseInput(path.resolve(__dirname, 'input.example.txt'));

console.log(
  waterPower(results)
);
```
