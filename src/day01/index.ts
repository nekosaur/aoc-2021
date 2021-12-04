import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(Number)

const sliding = (arr: number[], size: number) => {
  let current = arr.slice(0, size).reduce((curr, v) => curr + v, 0)
  const slid = [current]

  for (let i = 1; i <= arr.length - size; i += 1) {
    current -= arr[i - 1]
    current += arr[i + size - 1]

    slid.push(current)
  }

  return slid
}

const countIncreases = (arr: number[]) => {
  let increases = 0
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) increases++
  }

  return increases
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return countIncreases(sliding(input, 1))
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return countIncreases(sliding(input, 3))
}

const exampleInput = `
199
200
208
210
200
207
240
269
260
263`

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
