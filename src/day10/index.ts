import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.split(''))

const OPEN = ['(', '[', '{', '<']
const CLOSE = [')', ']', '}', '>']
const SCORE = [3, 57, 1197, 25137]

const repair = (chunk: string[]) => {
  const stack = []
  let corrupted = -1

  for (const c of chunk) {
    const openIndex = OPEN.findIndex(x => x === c)
    const closeIndex = CLOSE.findIndex(x => x === c)

    if (openIndex >= 0) {
      stack.push(openIndex)
    } else if (closeIndex >= 0) {
      if (stack[stack.length - 1] !== closeIndex && corrupted < 0) {
        corrupted = closeIndex
        break
      }

      stack.pop()
    }
  }

  return { corrupted, added: stack.reverse() }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let score = 0

  for (const chunk of input) {
    const { corrupted } = repair(chunk)
    score += corrupted >= 0 ? SCORE[corrupted] : 0
  }

  return score
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const score = input.flatMap(chunk => {
    const { corrupted, added } = repair(chunk)

    if (corrupted >= 0) return []

    return added.reduce((curr, i) => (curr * 5) + (i + 1), 0)
  }).sort((a, b) => a - b)

  return score[Math.floor(score.length / 2)]
}

const exampleInput = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`

run({
  part1: {
    tests: [
      { input: exampleInput, expected: 26397 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: exampleInput, expected: 288957 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
