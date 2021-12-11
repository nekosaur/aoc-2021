import run from 'aocrunner'
import { neighbours } from '../utils/index.js'

type MapData = {
  width: number
  height: number
  map: number[]
}

const parseInput = (rawInput: string) => {
  const rows = rawInput.split('\n')

  const width = rows[0].length
  const height = rows.length
  const map = rows.flatMap((row) => row.split('').map(Number))

  return {
    width,
    height,
    map,
  } as MapData
}

const findLowestPoints = ({ map, width, height }: MapData) => {
  const lowest = []

  for (let i = 0; i < map.length; i++) {
    const x = i % width
    const y = Math.floor(i / width)

    if (neighbours(map, i, width).every(([ni]) => map[ni] > map[i])) {
      lowest.push([i, x, y])
    }
  }

  return lowest
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return findLowestPoints(input).reduce((curr, [i]) => curr + (input.map[i] + 1), 0)
}

const findBasins = ({ map, width, height }: MapData, lowest: number[][]) => {
  const basins = []
  for (const [i] of lowest) {
    const basin = new Set<number>()

    const queue = [i]

    while (queue.length > 0) {
      const ci = queue.shift()!

      basin.add(ci)

      for (const [ni] of neighbours(map, ci, width)) {
        if (basin.has(ni) || map[ni] === 9) continue

        queue.push(ni)
      }
    }

    basins.push(basin.size)
  }

  return basins
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const lowest = findLowestPoints(input)

  return findBasins(input, lowest)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((curr, n) => curr * n, 1)
}

const exampleInput = `
2199943210
3987894921
9856789892
8767896789
9899965678`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 15 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 1134 }],
    solution: part2,
  },
  trimTestInputs: true,
})
