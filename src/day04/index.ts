import run from 'aocrunner'
import { range } from '../utils/index.js'

const parseInput = (rawInput: string): [number[], number[][]] => {
  const [numbers, ...boards] = rawInput.split('\n\n')

  return [
    numbers.split(',').map(Number),
    boards.map(board => board.replace(/\n/g, ' ').split(' ').filter(x => !!x).map(Number))
  ]
}

const score = (board: number[], numbers: number[], last: number) => {
  const exclude = numbers.slice(0, numbers.indexOf(last) + 1)

  return board.filter(v => !exclude.includes(v)).reduce((curr, v) => curr + v, 0) * last
}

function* play (numbers: number[], boards: number[][]) {
  const results = range(boards.length).map(() => new Map<string, number>())
  const finished = new Set()

  for (const number of numbers) {
    for (let i = 0; i < boards.length; i++) {
      if (finished.has(i)) continue

      const board = boards[i]
      const result = results[i]
  
      const bi = board.indexOf(number)

      if (bi < 0) continue

      const ri = `r${Math.floor(bi / 5)}`
      const ci = `c${bi % 5}`

      const rv = (result.get(ri) ?? 0) + 1
      const cv = (result.get(ci) ?? 0) + 1

      if (rv === 5 || cv === 5) {
        finished.add(i)
        yield score(board, numbers, number)
      } 

      result.set(ri, rv)
      result.set(ci, cv)
    }
  }

  return 0
}

const part1 = (rawInput: string) => {
  const [numbers, boards] = parseInput(rawInput)
  
  const it = play(numbers, boards)

  const { value } = it.next()

  return value
}

const part2 = (rawInput: string) => {
  const [numbers, boards] = parseInput(rawInput)

  const it = play(numbers, boards)

  let result = it.next()
  let last = 0
  
  while (!result.done) {
    last = result.value
    result = it.next()
  }

  return last
}

const exampleInput = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

run({
  part1: {
    tests: [
      { input: exampleInput, expected: 4512 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: exampleInput, expected: 1924 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
