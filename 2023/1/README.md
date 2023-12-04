# Post-solution thoughts

This is my first year doing this, so I wasn't really sure what to expect.

## Part 1

```javascript
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
```

1. Read the file from disk, use [`String.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) to remove whitespace at the edges (including the trailing `LF`), then use [`String.split()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) to split the document into lines.

1. Using [`Array.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), for each line, use [`String.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) to remove anything that isn't a digit.

1. From that, grab the first digit and the last digit. (`123` results in `13`, while `7` results in `77`.)

1. From that, use [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) to convert the string of digits into a proper integer (base 10).

1. Lastly, use [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) to add each of the results together into a single result value.

## Part 2

I would say this one was _simple_, but I think it tripped-up lots of people because the instructions were ambiguously written. Once I realized what the instructions _meant_, the solution was easy.

### Performing replacements

At first, I _replaced_ `one` with `1`, `two` with `2`, etc. But I soon noticed that in a case like `eightwo`, I'd get `eigh2` because `two` was replaced earlier than `eight`.

So then I switched it up to read left-to-right, and replace the first number I encountered on each line.

This meant using [`String.startsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) to look for the written-out forms of numbers. When I find them, replace them. Then move the pointer to the next character in sequence after the modified string.

But I was still getting the wrong result.

### Stop replacing

I ended up having to look up a hint, and someone posted `eightwo` should be `82`, and `sevenine` should be `79`. This was not part of the example data, which left me feeling annoyed. However, once I realized the issue, the fix was simple: stop replacing.

This meant using [`String.startsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) to look for the written-out forms of numbers. When I find them, leave them alone, but save the numeric form in a new string I'd use for output. The original input string, I mutated by removing the first character from the beginning of the string, then try again.

I used pretty much the same code from part 1, but injected this into the pipeline as a function:

```javascript
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
```

> [!NOTE]
> Yes, I'm aware that this could be a loop, but I'd still have to define the replacements anyway, so…

## Rewriting in another language

Some of my co-workers wrote their solutions in Go, and since I write a lot of Go, I decided to do a second implementation.

### Porting to Go

I started by doing a 1:1 port from JavaScript to Go, and everything worked. I also ported the tests I'd written for JavaScript over to Go, adopting Go's best practices (e.g., table-driven testing).

Since benchmarking and profiling are built into the Go toolchain, I set those up as well — both single-threaded and multi-threaded (possible in Go; JavaScript is inherently single-threaded).

```go
func BenchmarkParseInput(b *testing.B) {
  b.ReportAllocs()

  for name, tc := range testTable {
    b.Run(name, func(b *testing.B) {
      b.ResetTimer()
      for i := 0; i < b.N; i++ {
        _ = ParseInput(tc.Input)
      }
    })
  }
}

func BenchmarkParseInputParallel(b *testing.B) {
  b.ReportAllocs()

  for name, tc := range testTable {
    b.Run(name, func(b *testing.B) {
      b.ResetTimer()
      b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
          _ = ParseInput(tc.Input)
        }
      })
    })
  }
}
```

Results were… meh. In order to perform comparisons of benchmarking runs with `benchstat`, you need a minimum of 6 runs of each benchmark. Here were the results.

```plain
goos: darwin
goarch: arm64
pkg: adventofcode
BenchmarkParseInput/input.example.txt-10         	   80329	     14854 ns/op	    7730 B/op	      62 allocs/op
BenchmarkParseInput/input.example.txt-10         	   81392	     14813 ns/op	    7733 B/op	      62 allocs/op
BenchmarkParseInput/input.example.txt-10         	   80556	     14826 ns/op	    7737 B/op	      62 allocs/op
BenchmarkParseInput/input.example.txt-10         	   80187	     14833 ns/op	    7733 B/op	      62 allocs/op
BenchmarkParseInput/input.example.txt-10         	   80205	     14890 ns/op	    7731 B/op	      62 allocs/op
BenchmarkParseInput/input.example.txt-10         	   77648	     14799 ns/op	    7727 B/op	      62 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     648	   1704669 ns/op	  896237 B/op	   13672 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     692	   1724832 ns/op	  898014 B/op	   13672 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     703	   1704907 ns/op	  896587 B/op	   13672 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     709	   1700133 ns/op	  896192 B/op	   13672 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     705	   1699697 ns/op	  897029 B/op	   13672 allocs/op
BenchmarkParseInput/input.problem.txt-10         	     705	   1698968 ns/op	  897137 B/op	   13672 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    2232	    523310 ns/op	  903339 B/op	   13673 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    1993	    526837 ns/op	  902382 B/op	   13673 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    2294	    546449 ns/op	  901345 B/op	   13673 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    2160	    513378 ns/op	  902027 B/op	   13673 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    2400	    614057 ns/op	  901805 B/op	   13673 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	    2277	    735721 ns/op	  897483 B/op	   13672 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  133785	      9079 ns/op	    7741 B/op	      62 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  145710	      9142 ns/op	    7726 B/op	      62 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  153723	      7910 ns/op	    7698 B/op	      62 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  128452	      9208 ns/op	    7743 B/op	      62 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  145972	      7964 ns/op	    7738 B/op	      62 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	  150912	      8191 ns/op	    7730 B/op	      62 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   52462	     22812 ns/op	   11129 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   52984	     25018 ns/op	   11121 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   52489	     22779 ns/op	   11121 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   52542	     23251 ns/op	   11117 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   44289	     22754 ns/op	   11130 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	   52692	     22892 ns/op	   11135 B/op	     185 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   46425	     27268 ns/op	   13142 B/op	     229 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   42633	     27626 ns/op	   13146 B/op	     229 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   46670	     25774 ns/op	   13139 B/op	     229 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   44677	     26135 ns/op	   13132 B/op	     229 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   46573	     25670 ns/op	   13139 B/op	     229 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	   45081	     25726 ns/op	   13148 B/op	     229 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     457	   2668122 ns/op	 1252616 B/op	   34070 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     452	   2659306 ns/op	 1250470 B/op	   34069 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     454	   2631682 ns/op	 1250904 B/op	   34069 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     453	   2650667 ns/op	 1252433 B/op	   34070 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     450	   2642182 ns/op	 1251715 B/op	   34070 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	     453	   2665486 ns/op	 1252269 B/op	   34070 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1653	    747737 ns/op	 1250736 B/op	   34069 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1542	    729219 ns/op	 1248106 B/op	   34069 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1694	    675395 ns/op	 1252353 B/op	   34070 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1611	    710525 ns/op	 1252815 B/op	   34070 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1753	    684727 ns/op	 1250684 B/op	   34069 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	    1738	    700454 ns/op	 1253130 B/op	   34070 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  127599	      9300 ns/op	   11175 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  129166	      9280 ns/op	   11171 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  126476	      9483 ns/op	   11158 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  130896	      9190 ns/op	   11179 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  128017	      9479 ns/op	   11157 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	  125996	      9122 ns/op	   11136 B/op	     185 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  123045	      9776 ns/op	   13195 B/op	     229 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  126480	      9732 ns/op	   13143 B/op	     229 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  120024	      9831 ns/op	   13220 B/op	     229 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  122217	      9768 ns/op	   13160 B/op	     229 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  120700	      9706 ns/op	   13175 B/op	     229 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	  116074	      9665 ns/op	   13160 B/op	     229 allocs/op
PASS
ok  	adventofcode	83.617s
```

I knew that I could optimize for CPU performance and memory usage. Do I generated some profiling data for both, and used Go's toolchain to investigate where my code was spending its time. As I resolved one thing, I looked at the next most time-consuming code.

1. Switched from reading files from disk, to leveraging [Go embeds](https://pkg.go.dev/embed).
1. Replaced regular expressions (surprisingly slow) with iterating over a byte array (`[]byte`) and removing what I don’t need.
1. Reduced the amount of casting across types. (Go is strongly typed, and there are differences between `int` and `int64`, `string` and `[]byte`.)
1. Replaced traditional string concatenation with writing to a [`bytes.Buffer`](https://pkg.go.dev/bytes#Buffer).
1. Replaced [`strings.Split()`](https://pkg.go.dev/strings#Split) with finding the index of the `0x0A` byte (`LF`) and using that to index a byte array to determine what a “line” is.
1. Switched from [`strings.HasPrefix()`](https://pkg.go.dev/strings#HasPrefix) to counting bytes and manually comparing substrings.

While I wouldn't necessarily want to _maintain_ this code long term, I was able to see some pretty significant performance improvements.

The last run of the benchmarks looked like this:

```plain
goos: darwin
goarch: arm64
pkg: adventofcode
BenchmarkParseInput/input.example.txt-10         	 6088711	       196.8 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.example.txt-10         	 6104182	       197.5 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.example.txt-10         	 6083482	       196.6 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.example.txt-10         	 6080955	       197.4 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.example.txt-10         	 6092566	       196.2 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.example.txt-10         	 6045516	       196.6 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12763	     96346 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12790	     93939 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12679	     93776 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12763	     93856 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12742	     94023 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput/input.problem.txt-10         	   12786	     93480 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	35171146	        35.84 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	32823878	        36.02 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	29894372	        35.00 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	31196076	        36.44 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	32643734	        37.34 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.example.txt-10 	32273644	        36.22 ns/op	      32 B/op	       4 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   69634	     17910 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   72495	     16819 ns/op	   15313 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   72672	     16748 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   72806	     16153 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   71631	     16692 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInputParallel/input.problem.txt-10 	   72782	     16757 ns/op	   15312 B/op	    1151 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1096 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1092 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1091 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1095 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1093 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.txt-10       	 1000000	      1093 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  875635	      1375 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  870877	      1369 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  871646	      1369 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  862068	      1379 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  890210	      1376 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.example2.5.txt-10     	  879802	      1398 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4712	    255259 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4622	    254950 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4575	    254952 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4676	    254910 ns/op	  136112 B/op	    3007 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4686	    254314 ns/op	  136116 B/op	    3007 allocs/op
BenchmarkParseInput2/input.problem.txt-10        	    4656	    255170 ns/op	  136112 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   17545	     69776 ns/op	  136114 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   16488	     67778 ns/op	  136118 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   17691	     67625 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   18318	     66111 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   18736	     70806 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.problem.txt-10         	   18739	     65243 ns/op	  136113 B/op	    3007 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 3089607	       374.0 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 2965598	       386.4 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 3260359	       375.3 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 3022448	       371.2 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 3204992	       389.8 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.txt-10        	 3210306	       372.8 ns/op	     952 B/op	      21 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2522180	       487.2 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2489923	       490.5 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2419711	       475.8 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2375548	       488.9 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2581488	       476.1 ns/op	    1224 B/op	      27 allocs/op
BenchmarkParseInput2Parallel/input.example2.5.txt-10      	 2383987	       512.2 ns/op	    1224 B/op	      27 allocs/op
PASS
ok  	adventofcode	89.430s
```

After comparing both sets of results using `benchstat`, I was able to see the following improvements.

> [!NOTE]
> I configured `benchstat` to show me the _increase of fastness_ rather than a _decrease in slowness_. The positive values below measure _improvement_.

```plain
goos: darwin
goarch: arm64
pkg: adventofcode
                                            │   Current   │                 Previous                 │
                                            │   sec/op    │     sec/op      vs base                  │
ParseInput/input.example.txt-10               196.7n ± 0%   14829.5n ±  0%   +7439.15% (p=0.002 n=6)
ParseInput/input.problem.txt-10               93.90µ ± 3%   1702.40µ ±  1%   +1713.04% (p=0.002 n=6)
ParseInputParallel/input.example.txt-10       36.12n ± 3%   8635.00n ±  8%  +23806.42% (p=0.002 n=6)
ParseInputParallel/input.problem.txt-10       16.75µ ± 7%    536.64µ ± 37%   +3103.36% (p=0.002 n=6)
ParseInput2/input.example2.txt-10             1.093µ ± 0%    22.852µ ±  9%   +1990.76% (p=0.002 n=6)
ParseInput2/input.example2.5.txt-10           1.376µ ± 2%    25.955µ ±  6%   +1786.91% (p=0.002 n=6)
ParseInput2/input.problem.txt-10              255.0µ ± 0%    2655.0µ ±  1%    +941.37% (p=0.002 n=6)
ParseInput2Parallel/input.problem.txt-10      67.70µ ± 5%    705.49µ ±  6%    +942.06% (p=0.002 n=6)
ParseInput2Parallel/input.example2.txt-10     374.7n ± 4%    9290.0n ±  2%   +2379.65% (p=0.002 n=6)
ParseInput2Parallel/input.example2.5.txt-10   488.0n ± 5%    9750.0n ±  1%   +1897.75% (p=0.002 n=6)
geomean                                       2.968µ          80.74µ         +2620.40%

                                            │   Current    │                Previous                 │
                                            │     B/op     │     B/op       vs base                  │
ParseInput/input.example.txt-10                 32.00 ± 0%    7732.00 ± 0%  +24062.50% (p=0.002 n=6)
ParseInput/input.problem.txt-10               14.95Ki ± 0%   875.79Ki ± 0%   +5756.90% (p=0.002 n=6)
ParseInputParallel/input.example.txt-10         32.00 ± 0%    7734.00 ± 0%  +24068.75% (p=0.002 n=6)
ParseInputParallel/input.problem.txt-10       14.95Ki ± 0%   880.78Ki ± 0%   +5790.26% (p=0.002 n=6)
ParseInput2/input.example2.txt-10               952.0 ± 0%    11125.0 ± 0%   +1068.59% (p=0.002 n=6)
ParseInput2/input.example2.5.txt-10           1.195Ki ± 0%   12.833Ki ± 0%    +973.57% (p=0.002 n=6)
ParseInput2/input.problem.txt-10              132.9Ki ± 0%   1222.6Ki ± 0%    +819.82% (p=0.002 n=6)
ParseInput2Parallel/input.problem.txt-10      132.9Ki ± 0%   1222.2Ki ± 0%    +819.49% (p=0.002 n=6)
ParseInput2Parallel/input.example2.txt-10       952.0 ± 0%    11164.5 ± 0%   +1072.74% (p=0.002 n=6)
ParseInput2Parallel/input.example2.5.txt-10   1.195Ki ± 0%   12.859Ki ± 0%    +975.78% (p=0.002 n=6)
geomean                                       2.332Ki         64.70Ki        +2673.87%

                                            │   Current   │               Previous                │
                                            │  allocs/op  │  allocs/op    vs base                 │
ParseInput/input.example.txt-10                4.000 ± 0%    62.000 ± 0%  +1450.00% (p=0.002 n=6)
ParseInput/input.problem.txt-10               1.151k ± 0%   13.672k ± 0%  +1087.84% (p=0.002 n=6)
ParseInputParallel/input.example.txt-10        4.000 ± 0%    62.000 ± 0%  +1450.00% (p=0.002 n=6)
ParseInputParallel/input.problem.txt-10       1.151k ± 0%   13.673k ± 0%  +1087.92% (p=0.002 n=6)
ParseInput2/input.example2.txt-10              21.00 ± 0%    185.00 ± 0%   +780.95% (p=0.002 n=6)
ParseInput2/input.example2.5.txt-10            27.00 ± 0%    229.00 ± 0%   +748.15% (p=0.002 n=6)
ParseInput2/input.problem.txt-10              3.007k ± 0%   34.070k ± 0%  +1033.02% (p=0.002 n=6)
ParseInput2Parallel/input.problem.txt-10      3.007k ± 0%   34.069k ± 0%  +1033.01% (p=0.002 n=6)
ParseInput2Parallel/input.example2.txt-10      21.00 ± 0%    185.00 ± 0%   +780.95% (p=0.002 n=6)
ParseInput2Parallel/input.example2.5.txt-10    27.00 ± 0%    229.00 ± 0%   +748.15% (p=0.002 n=6)
geomean                                        95.27         1.041k        +992.83%
```

The first group is _raw performance_. The second group is _bytes of memory allocated per iteration_. The third group is the _number of memory allocations per iteration_.

The worst improvement was `748%`, while the best improvement was `24,068%`.

## Final thoughts

I think I'm going to continue doing these in JavaScript on the daily because it's quick to write. But porting to Go, and optimizing performance and memory usage was a fun exercise.
