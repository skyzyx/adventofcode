# Post-solution thoughts

I've now done a few of these, so I feel like I'm beginning to get into a rhythm. Reading a file, trimming any prepended/appended whitespace, and splitting into lines with `LF` (I'm on macOS) has become a standard thing.

## Differences between example and real input

Again, if you need to parse a string into a particular format, regular expressions (in JavaScript) is going to be the lowest-effort approach. But I ended up with some unexpected values because of subtle differences in each input file.

Example data:

```plain
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
```

Real data (last few characters trimmed):

```plain
Card   1: 84 17 45 77 11 66 94 28 71 70 | 45 51 86 83 53 58 64 30 67 96 41 89  8
Card  10: 39  3 43 61 53 40 89 16 60 12 | 47 44 63  1 67 26 55 12 20 68 78 92 56
Card 100: 93 90 23 71 16 47 15 49 73 21 | 54 14 92 44 20 87 48  3 15 88 83  2 12
```

### Casting to `Number`

If you take the example _Card 1_ data, and take _just_ my scratchcard numbers (`83 86  6 31 17  9 48 53`), and you split on the space character (ASCII `0x20`) you get the following:

```javascript
['83', '86', '', '6', '31', '17', '', '9', '48', '53']
```

In my initial implementation, I wasn't looking closely enough at the parsed data, and tried to cast all of the aforementioned values to `Number`.

```javascript
['83', '86', '', '6', '31', '17', '', '9', '48', '53'].map(Number)
//=> [83, 86, 0, 6, 31, 17, 0, 9, 48, 53]
```

This ended up giving an incorrect set of winning values because a space character got transposed into a `0`. So I ended up filtering-out the empty strings before casting to `Number`.

```javascript
['83', '86', '', '6', '31', '17', '', '9', '48', '53'].filter(e => !!e.length).map(Number)
//=> [83, 86, 6, 31, 17, 9, 48, 53]
```

### Failing regex

At first, I tried to match `card` (space) (number). This worked with the example data, but failed on the real data until I reached _Card 100_. It began with this:

```regex
/^card\s(?<card>\d+): …
```

So I just needed to allow multiple spaces after `card` with `\s+`.

```regex
/^card\s+(?<card>\d+): …
```

## Part 1

The word for what we need here is _intersection_. Which values _intersect_ both the winning numbers, and the numbers we have?

```javascript
function intersection(a, b) {
  return a.filter(e => b.includes(e));
}
```

Beyond this, where $n$ is the number of matching results, points for each card are calculated as $2^{n-1}$ where $\left(n-1\right)>=0$. Then you just add up the points for each of the cards.

## Part 2

I was originally planning to figure out how to append the number of times we encountered a card to the card itself. But I found it was simpler to create a second _Map_ (_Object_) to store the counts, which allowed me to just lookup the set of matching cards and append them to the stack of cards itself.

At the end, I was able to read all of the values from the new _Map_ (_Object_) and return the value in one swoop.


```javascript
return Object.values(counter).reduce((a, e) => a + e, 0);
```
