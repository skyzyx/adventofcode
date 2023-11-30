// https://adventofcode.com/2022/day/1
function calories(input) {
  return input
    .map((e, i) => {
      return {
        k: i + 1,
        v: e.reduce((a, e) => a + e),
      };
    })
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map(e => e.v)
    .reduce((a, e) => a + e);
}

module.exports = calories;
