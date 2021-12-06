import run from 'aocrunner'
import { range, sum } from '../utils/index.js'

const parseInput = (rawInput: string) => rawInput.split(',').map(Number)

const simulate = (fish: number[], days: number) => {
  const buckets: bigint[] = range(9).map(() => 0n)

  for (const f of fish) {
    buckets[f] = buckets[f] + 1n
  }

  for (let d = 0; d < days; d++) {
    const zeroes = buckets.shift() ?? 0n

    buckets.push(zeroes)

    buckets[6] += zeroes
  }

  return sum(buckets)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return simulate(input, 80)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return simulate(input, 256)
}

const exampleInput = `3,4,3,1,2`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 5_934n }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 26_984_457_539n }],
    solution: part2,
  },
  trimTestInputs: true,
})
