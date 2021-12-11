import run from 'aocrunner'

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

const neighbours = (map: number[], i: number, width: number) => {
  const positions = [
    i % width > 0 && i - 1,
    i % width > 0 && i - width - 1,
    i % width > 0 && i + width - 1,
    i - width,
    i % width < width - 1 && i + 1,
    i % width < width - 1 && i + width + 1,
    i % width < width - 1 && i - width + 1,
    i + width,
  ]
    .map((i) => {
      if (i === false || map[i] == null) return null

      return [i, i % width, Math.floor(i / width)]
    })
    .filter((x) => !!x) as number[][]

  return positions
}

function* step({ map, width }: MapData) {
  let flashes = 0
  let steps = 0

  while (true) {
    const queue = []

    for (let mi = 0; mi < map.length; mi++) {
      map[mi] += 1

      if (map[mi] > 9) {
        queue.push(mi)
      }
    }

    const flashed = new Set<number>([...queue])

    while (queue.length) {
      const ci = queue.shift()

      if (ci == null) throw new Error('foo')

      for (const [ni] of neighbours(map, ci, width)) {
        if (flashed.has(ni)) continue

        map[ni] += 1

        if (map[ni] > 9) {
          flashed.add(ni)
          queue.push(ni)
        }
      }
    }

    for (const fi of flashed) {
      map[fi] = 0
    }

    steps += 1

    if (flashed.size === map.length) return steps

    flashes += flashed.size

    yield flashes
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const gen = step(input)
  let flashes = 0

  for (let i = 0; i < 100; i++) {
    flashes = gen.next().value
  }

  return flashes
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const gen = step(input)
  let it = gen.next()
  let sync = 0

  while (!it.done) {
    it = gen.next()
    sync = it.value
  }

  return sync
}

const exampleInput = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`

run({
  part1: {
    tests: [{ input: exampleInput, expected: 1656 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: exampleInput, expected: 195 }],
    solution: part2,
  },
  trimTestInputs: true,
})
