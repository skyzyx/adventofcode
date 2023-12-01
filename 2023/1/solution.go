// https://adventofcode.com/2023/day/1
package adventofcode

import (
	"bytes"
	"fmt"
	"strconv"
	"strings"
)

func ParseInput(f string) int {
	var output int
	lines := strings.Split(f, "\n")

	for i := range lines {
		line := lines[i]
		bytestream := []byte(line)

		var bDigits []byte

		for i := range bytestream {
			b := bytestream[i]

			if b >= 48 && b < 58 {
				bDigits = append(bDigits, b)
			}
		}

		if len(bDigits) == 0 {
			continue
		}

		firstLast := string(bDigits[0:1]) + string(bDigits[len(bDigits)-1:])

		intDigits, err := strconv.Atoi(firstLast)
		if err != nil {
			fmt.Println(err)
		}

		output += intDigits
	}

	return output
}

func ParseInput2(f string) int {
	var intOutput int

	lines := strings.Split(f, "\n")

	for i := range lines {
		s := lines[i]

		var output bytes.Buffer

		for len(s) > 0 {
			if len(s) >= 3 && s[0:3] == "one" {
				_, _ = output.WriteString("1")
			} else if len(s) >= 3 && s[0:3] == "two" {
				_, _ = output.WriteString("2")
			} else if len(s) >= 5 && s[0:5] == "three" {
				_, _ = output.WriteString("3")
			} else if len(s) >= 4 && s[0:4] == "four" {
				_, _ = output.WriteString("4")
			} else if len(s) >= 4 && s[0:4] == "five" {
				_, _ = output.WriteString("5")
			} else if len(s) >= 3 && s[0:3] == "six" {
				_, _ = output.WriteString("6")
			} else if len(s) >= 5 && s[0:5] == "seven" {
				_, _ = output.WriteString("7")
			} else if len(s) >= 5 && s[0:5] == "eight" {
				_, _ = output.WriteString("8")
			} else if len(s) >= 4 && s[0:4] == "nine" {
				_, _ = output.WriteString("9")
			} else {
				_, _ = output.WriteString(s[0:1])
			}

			s = s[1:]
		}

		bytestream := output.Bytes()
		var bDigits []byte

		for i := range bytestream {
			b := bytestream[i]

			if b >= 48 && b < 58 {
				bDigits = append(bDigits, b)
			}
		}

		if len(bDigits) == 0 {
			continue
		}

		var firstLast bytes.Buffer

		firstLast.WriteByte(bDigits[0:1][0])
		firstLast.WriteByte(bDigits[len(bDigits)-1:][0])

		intDigits, err := strconv.Atoi(firstLast.String())
		if err != nil {
			fmt.Println(err)
		}

		intOutput += intDigits
	}

	return intOutput
}
