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
			if strings.HasPrefix(s, "one") {
				_, _ = output.WriteString("1")
			} else if strings.HasPrefix(s, "two") {
				_, _ = output.WriteString("2")
			} else if strings.HasPrefix(s, "three") {
				_, _ = output.WriteString("3")
			} else if strings.HasPrefix(s, "four") {
				_, _ = output.WriteString("4")
			} else if strings.HasPrefix(s, "five") {
				_, _ = output.WriteString("5")
			} else if strings.HasPrefix(s, "six") {
				_, _ = output.WriteString("6")
			} else if strings.HasPrefix(s, "seven") {
				_, _ = output.WriteString("7")
			} else if strings.HasPrefix(s, "eight") {
				_, _ = output.WriteString("8")
			} else if strings.HasPrefix(s, "nine") {
				_, _ = output.WriteString("9")
			} else {
				_, _ = output.WriteString(s[0:1])
			}

			s = s[1:]
		}

		bytestream := []byte(output.String())
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
