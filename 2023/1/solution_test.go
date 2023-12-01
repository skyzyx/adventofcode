// https://adventofcode.com/2023/day/1
package adventofcode

import (
	_ "embed"
	"fmt"
	"testing"
)

const (
	CInputExample   = "input.example.txt"
	CInputExample2  = "input.example2.txt"
	CInputExample25 = "input.example2.5.txt"
	CInputProblem   = "input.problem.txt"
)

var (
	//go:embed input.example.txt
	InputExample string

	//go:embed input.example2.txt
	InputExample2 string

	//go:embed input.example2.5.txt
	InputExample25 string

	//go:embed input.problem.txt
	InputProblem string

	testTable = map[string]struct { // lint:no_dupe
		Input    string
		Expected int
	}{
		CInputExample: {
			Input:    InputExample,
			Expected: 142, // lint:allow_raw_number
		},
		CInputProblem: {
			Input:    InputProblem,
			Expected: 54940, // lint:allow_raw_number
		},
	}

	testTable2 = map[string]struct { // lint:no_dupe
		Input    string
		Expected int
	}{
		CInputExample2: {
			Input:    InputExample2,
			Expected: 281, // lint:allow_raw_number
		},
		CInputExample25: {
			Input:    InputExample25,
			Expected: 443, // lint:allow_raw_number
		},
		CInputProblem: {
			Input:    InputProblem,
			Expected: 54208, // lint:allow_raw_number
		},
	}
)

func ExampleParseInput() {
	output1 := ParseInput(InputExample)
	fmt.Println(output1)

	output2 := ParseInput(InputProblem)
	fmt.Println(output2)

	// Output:
	// 142
	// 54940
}

func ExampleParseInput2() {
	output1 := ParseInput2(InputExample2)
	fmt.Println(output1)

	output2 := ParseInput2(InputExample25)
	fmt.Println(output2)

	output3 := ParseInput2(InputProblem)
	fmt.Println(output3)

	// Output:
	// 281
	// 443
	// 54208
}

func TestParseInput(t *testing.T) {
	for name, tc := range testTable {
		t.Run(name, func(t *testing.T) {
			output := ParseInput(tc.Input)

			if output != tc.Expected {
				t.Errorf("Expected %d, got %d", tc.Expected, output)
			}
		})
	}
}

func TestParseInput2(t *testing.T) {
	for name, tc := range testTable2 {
		t.Run(name, func(t *testing.T) {
			output := ParseInput2(tc.Input)

			if output != tc.Expected {
				t.Errorf("Expected %d, got %d", tc.Expected, output)
			}
		})
	}
}

func BenchmarkParseInput(b *testing.B) {
	b.ReportAllocs()

	for name, tc := range testTable {
		b.Run(name, func(b *testing.B) {
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				_ = ParseInput(tc.Input) // lint:allow_unhandled
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
					_ = ParseInput(tc.Input) // lint:allow_unhandled
				}
			})
		})
	}
}

func BenchmarkParseInput2(b *testing.B) {
	b.ReportAllocs()

	for name, tc := range testTable2 {
		b.Run(name, func(b *testing.B) {
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				_ = ParseInput2(tc.Input) // lint:allow_unhandled
			}
		})
	}
}

func BenchmarkParseInput2Parallel(b *testing.B) {
	b.ReportAllocs()

	for name, tc := range testTable2 {
		b.Run(name, func(b *testing.B) {
			b.ResetTimer()
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					_ = ParseInput2(tc.Input) // lint:allow_unhandled
				}
			})
		})
	}
}
