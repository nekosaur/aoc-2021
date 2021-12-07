import run from 'aocrunner'
import { minmax } from '../utils/index.js'

const parseInput = (rawInput: string) => rawInput.split(',').map(Number)

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const [min, max] = minmax(input)

  let cost = Number.MAX_VALUE
  for (let p = min; p <= max; p++) {
    const pcost = input.reduce((curr, crab) => curr + Math.abs(crab - p), 0)

    if (pcost < cost) cost = pcost
  }

  return cost
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const [min, max] = minmax(input)

  let cost = Number.MAX_VALUE
  for (let p = min; p <= max; p++) {
    const pcost = input.reduce((curr, crab) => {
      const n = Math.abs(crab - p)
      return curr + (n * (n + 1)) / 2
    }, 0)

    if (pcost < cost) cost = pcost
  }

  return cost
}

const exampleInput = `16,1,2,0,4,2,7,1,2,14`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
})
