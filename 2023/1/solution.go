// https://adventofcode.com/2023/day/1
package adventofcode

import (
	"bufio"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

func readFileIntoLines(f string) []string {
	fs := bufio.NewScanner(strings.NewReader(f))
	fs.Split(bufio.ScanLines)

	var lines []string

	for fs.Scan() {
		lines = append(lines, fs.Text())
	}

	return lines
}

func ParseInput(f string) int {
	var output int

	file := readFileIntoLines(f)

	for i := range file {
		line := file[i]

		reDigits := regexp.MustCompile("[^\\d]")
		strDigits := reDigits.ReplaceAllString(line, "")
		firstLast := strDigits[0:1] + strDigits[len(strDigits)-1:]

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

	file := readFileIntoLines(f)

	for i := range file {
		s := file[i]

		var output string

		for len(s) > 0 {
			if strings.HasPrefix(s, "one") {
				output += "1"
			} else if strings.HasPrefix(s, "two") {
				output += "2"
			} else if strings.HasPrefix(s, "three") {
				output += "3"
			} else if strings.HasPrefix(s, "four") {
				output += "4"
			} else if strings.HasPrefix(s, "five") {
				output += "5"
			} else if strings.HasPrefix(s, "six") {
				output += "6"
			} else if strings.HasPrefix(s, "seven") {
				output += "7"
			} else if strings.HasPrefix(s, "eight") {
				output += "8"
			} else if strings.HasPrefix(s, "nine") {
				output += "9"
			} else {
				output += s[0:1]
			}

			s = s[1:]
		}

		reDigits := regexp.MustCompile("[^\\d]")
		strDigits := reDigits.ReplaceAllString(output, "")
		firstLast := strDigits[0:1] + strDigits[len(strDigits)-1:]

		intDigits, err := strconv.Atoi(firstLast)
		if err != nil {
			fmt.Println(err)
		}

		intOutput += intDigits
	}

	return intOutput
}
