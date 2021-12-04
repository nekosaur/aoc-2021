import run from 'aocrunner'

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split('').map(Number))

const range = (length: number, start = 0) =>
  [...Array(length).keys()].map((i) => i + start)

const transpose = (arr: number[][]) => {
  return range(arr[0].length).map((i) =>
    range(arr.length).map((j) => arr[j][i]),
  )
}

const count = (arr: number[]): [number, number] =>
  arr.reduce(
    ([zeroes, ones], bit) => {
      return bit === 0 ? [zeroes + 1, ones] : [zeroes, ones + 1]
    },
    [0, 0],
  )

const part1 = (rawInput: string) => {
  const calculate = () => {
    const input = parseInput(rawInput)
    const transposed = transpose(input)
    const gamma = []
    const epsilon = []

    for (const col of transposed) {
      const [zeroes, ones] = count(col)

      gamma.push(zeroes > ones ? 0 : 1)
      epsilon.push(zeroes > ones ? 1 : 0)
    }

    return [parseInt(gamma.join(''), 2), parseInt(epsilon.join(''), 2)]
  }

  const [gamma, epsilon] = calculate()

  return gamma * epsilon
}

const part2 = (rawInput: string) => {
  const calculate = (callback: (counts: [number, number]) => number) => {
    let numbers = parseInput(rawInput)
    let numColumns = numbers.length
    let index = 0

    while (index < numColumns) {
      const transposed = transpose(numbers)
      const counts = count(transposed[index])

      numbers = numbers.filter((row) => row[index] === callback(counts))

      if (numbers.length === 1) break

      index += 1
    }

    return parseInt(numbers[0].join(''), 2)
  }

  const oxygen = calculate(([zeroes, ones]) => (ones >= zeroes ? 1 : 0))

  const c02 = calculate(([zeroes, ones]) => (ones >= zeroes ? 0 : 1))

  return oxygen * c02
}

const exampleInput = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 198 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 230 }],
    solution: part2,
  },
  trimTestInputs: true,
})
