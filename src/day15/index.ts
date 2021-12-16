import run from 'aocrunner'
import heap from 'heap'
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

const astar = ({ map, width }: MapData, start: number, goal: number, heuristic: Function) => {
  const gCosts: Map<number, number> = new Map()
  const fCosts: Map<number, number> = new Map()
  const status: Set<number> = new Set()

  const openList = new heap<number>((a, b) => {
    const af = fCosts.get(a)
    const bf = fCosts.get(b)

    if (!af || !bf) throw new Error('foo')

    return af - bf
  })

  gCosts.set(start, 0)
  fCosts.set(start, heuristic(start, goal))
  status.add(start)
  openList.push(start)

  while (!openList.empty()) {
    const current = openList.pop()

    if (current == null) throw new Error('foo')

    if (current === goal) {
      return gCosts.get(goal)
    }

    for (const [n] of neighbours(map, current, width)) {
      const gCost = (gCosts.get(current) ?? 0) + map[n]
      const oldGCost = gCosts.get(n) ?? Infinity

      if (gCost < oldGCost) {
        gCosts.set(n, gCost)
        fCosts.set(n, gCost + heuristic(n, goal))

        if (!status.has(n)) {
          status.add(n)
          openList.push(n)
        } else {
          openList.updateItem(n)
        }
      }
    }
  }

  return -1
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const score = astar(input, 0, input.map.length - 1, (a: number, b: number) => {
    const [ax, ay] = [a % input.width, Math.floor(a / input.width)]
    const [bx, by] = [b % input.width, Math.floor(b / input.width)]

    return Math.abs(ax - bx) + Math.abs(ay - by)
  })

  return score
}

const expand = ({ map, width, height }: MapData, times: number = 5) => {
  const firstRow = []

  for (let y = 0; y < height; y++) {
    for (let i = 0; i < times; i++) {
      firstRow.push(
        ...map.slice(y * width, y * width + width).map((v) => {
          const n = v + i
          return n > 9 ? (n % 10) + 1 : n
        }),
      )
    }
  }

  const expanded = [...firstRow]

  for (let y = 1; y < times; y++) {
    expanded.push(
      ...firstRow.map((v, i) => {
        const n = v + y

        return n > 9 ? (n % 10) + 1 : n
      }),
    )
  }

  return {
    map: expanded,
    width: width * times,
    height: height * times,
  }
}

const part2 = (rawInput: string) => {
  const small = parseInput(rawInput)

  const input = expand(small)

  const score = astar(input, 0, input.map.length - 1, (a: number, b: number) => {
    const [ax, ay] = [a % input.width, Math.floor(a / input.width)]
    const [bx, by] = [b % input.width, Math.floor(b / input.width)]

    return Math.abs(ax - bx) + Math.abs(ay - by)
  })

  return score
}

const exampleInput = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 40 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 315 }],
    solution: part2,
  },
  trimTestInputs: true,
})
