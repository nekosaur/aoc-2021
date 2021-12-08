import run from 'aocrunner'
import { difference, intersection } from '../utils/index.js'

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => {
    const [signals, numbers] = row.split(' | ')
    return [signals, numbers] as const
  })

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const lengths = [2, 3, 4, 7]

  return input.reduce(
    (curr, [_, numbers]) =>
      curr + numbers.split(' ').filter((n) => lengths.includes(n.length)).length,
    0,
  )
}

const pick = (sets: Set<string>[], callback: (set: Set<string>) => boolean) => {
  const set = sets.find(callback)

  if (!set) throw new Error('Something went horribly wrong')

  return set
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map(([signals, numbers]) => {
    return [
      signals.split(' ').map((s) => new Set(s.split('').sort())),
      numbers.split(' ').map((n) => n.split('').sort().join('')),
    ] as const
  })

  let sum = 0

  for (const [signals, numbers] of input) {
    const one = pick(signals, (s) => s.size === 2)
    const four = pick(signals, (s) => s.size === 4)
    const seven = pick(signals, (s) => s.size === 3)
    const eight = pick(signals, (s) => s.size === 7)
    const six = pick(signals, (s) => s.size === 6 && difference(one, s).size > 0)
    const nine = pick(signals, (s) => s.size === 6 && intersection(four, s).size === 4)
    const zero = pick(signals, (s) => s.size === 6 && s !== six && s !== nine)
    const five = pick(signals, (s) => s.size === 5 && intersection(six, s).size === 5)
    const three = pick(signals, (s) => s.size === 5 && intersection(one, s).size === 2)
    const two = pick(signals, (s) => s.size === 5 && s !== five && s !== three)

    const found = [zero, one, two, three, four, five, six, seven, eight, nine].map((s) =>
      [...s].join(''),
    )

    const value = Number(numbers.reduce((str, n) => `${str}${found.findIndex((f) => f === n)}`, ''))

    sum += value
  }

  return sum
}

const exampleInput = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 26 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 61229 }],
    solution: part2,
  },
  trimTestInputs: true,
})
