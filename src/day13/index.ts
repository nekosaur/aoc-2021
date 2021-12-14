import run from 'aocrunner'
import { range } from '../utils/index.js'

const parseInput = (rawInput: string) => {
  const [dots, folds] = rawInput.split('\n\n')

  return [
    dots.split('\n').map((row) => row.split(',').map(Number)),
    folds.split('\n').map((row) => {
      const [dir, pos] = row.replace('fold along ', '').split('=')
      return [dir, Number(pos)]
    }),
  ] as [number[][], [string, number][]]
}

const folded = (dots: number[][], dir: string, pos: number) => {
  return dots.filter(([x, y]) => {
    if (dir === 'y') return y > pos
    else return x > pos
  })
}

const fold = (dots: number[][], folds: [string, number][]) => {
  for (const [dir, pos] of folds) {
    for (const dot of folded(dots, dir, pos)) {
      if (dir === 'y') {
        dot[1] = dot[1] - (dot[1] - pos) * 2
      } else {
        dot[0] = dot[0] - (dot[0] - pos) * 2
      }
    }
  }

  return dots
}

const part1 = (rawInput: string) => {
  const [dots, folds] = parseInput(rawInput)

  const folded = fold(dots, folds.slice(0, 1))

  const unique = new Set(folded.map(([x, y]) => `${x}_${y}`))

  return unique.size
}

const display = (dots: number[][]) => {
  const width = Math.max(...dots.map((dot) => dot[0]))
  const height = Math.max(...dots.map((dot) => dot[1]))
  const out = range(height + 1).map((_) => range(width + 1).map((_) => ' '))

  for (const [x, y] of dots) {
    out[y][x] = '#'
  }

  for (const row of out) {
    console.log(row.join(''))
  }
}

const part2 = (rawInput: string) => {
  const [dots, folds] = parseInput(rawInput)

  const folded = fold(dots, folds)

  display(folded)

  return 'BLKJRBAG'
}

const exampleInput = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 17 }],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
