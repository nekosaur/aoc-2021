import run from 'aocrunner'
import { minmax } from '../utils/index.js'

const parseInput = (rawInput: string) => {
  const [template, rules] = rawInput.split('\n\n')

  return [
    template.split(''),
    rules.split('\n').reduce((map, rule) => {
      const [pair, element] = rule.split(' -> ')
      map.set(pair, element)
      return map
    }, new Map<string, string>()),
  ] as [string[], Map<string, string>]
}

const count = (template: string[], rules: Map<string, string>, steps: number) => {
  let counts = new Map<string, bigint>()

  for (let i = 0; i < template.length - 1; i++) {
    const pair = `${template[i]}${template[i + 1]}`
    counts.set(pair, (counts.get(pair) ?? 0n) + 1n)
  }

  for (let i = 0; i < steps; i++) {
    const newCounts = new Map<string, bigint>()

    for (const [pair, value] of counts.entries()) {
      const [left, right] = pair.split('')
      const c = rules.get(pair)

      if (!c) throw new Error('foo')

      const lpair = `${left}${c}`
      const rpair = `${c}${right}`

      newCounts.set(lpair, (newCounts.get(lpair) ?? 0n) + value)
      newCounts.set(rpair, (newCounts.get(rpair) ?? 0n) + value)
    }

    counts = newCounts
  }

  const result = new Map<string, bigint>()

  // First char goes missing without this since we count right sides
  result.set(template[0], 1n)

  // Count only right side of pairs to get correct amounts
  for (const [key, value] of counts.entries()) {
    const [_, right] = key.split('')
    result.set(right, (result.get(right) ?? 0n) + value)
  }

  const [min, max] = minmax([...result.values()])

  return max - min
}

const part1 = (rawInput: string) => {
  const [template, rules] = parseInput(rawInput)

  return count(template, rules, 10)
}

const part2 = (rawInput: string) => {
  const [template, rules] = parseInput(rawInput)

  return count(template, rules, 40)
}

const exampleInput = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 1588n }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 2188189693529n }],
    solution: part2,
  },
  trimTestInputs: true,
})
