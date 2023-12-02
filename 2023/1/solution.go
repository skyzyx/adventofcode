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

	for len(f) > 0 {
		delim := strings.IndexByte(f, 0x0A)
		line := f[0:delim]
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
		f = f[delim+1:]
	}

	return output
}

func ParseInput2(f string) int {
	var intOutput int

	for len(f) > 0 {
		delim := strings.IndexByte(f, 0x0A)
		s := f[0:delim]

		var output bytes.Buffer

		for len(s) > 0 {
			if len(s) >= 3 && s[0:3] == "one" {
				_ = output.WriteByte('1')
			} else if len(s) >= 3 && s[0:3] == "two" {
				_ = output.WriteByte('2')
			} else if len(s) >= 5 && s[0:5] == "three" {
				_ = output.WriteByte('3')
			} else if len(s) >= 4 && s[0:4] == "four" {
				_ = output.WriteByte('4')
			} else if len(s) >= 4 && s[0:4] == "five" {
				_ = output.WriteByte('5')
			} else if len(s) >= 3 && s[0:3] == "six" {
				_ = output.WriteByte('6')
			} else if len(s) >= 5 && s[0:5] == "seven" {
				_ = output.WriteByte('7')
			} else if len(s) >= 5 && s[0:5] == "eight" {
				_ = output.WriteByte('8')
			} else if len(s) >= 4 && s[0:4] == "nine" {
				_ = output.WriteByte('9')
			} else {
				_ = output.WriteByte(s[0:1][0])
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

		if len(f) > delim+1 {
			f = f[delim+1:]
		} else {
			f = ""
		}
	}

	return intOutput
}
