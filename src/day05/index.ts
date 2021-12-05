import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => {
  return row.split(' -> ').flatMap(p => p.split(',').map(Number))
})

const count = (lines: number[][]) => {
  const seen = new Map<number, boolean>()
  let count = 0

  for (const [x1, y1, x2, y2] of lines) {
    const dx = x1 === x2 ? 0 : x2 - x1 < 0 ? -1 : 1
    const dy = y1 === y2 ? 0 : y2 - y1 < 0 ? -1 : 1
    let x = x1
    let y = y1

    for (let i = 0; i <= Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)); i++) {
      const key = (y * 1000) + x

      if (!seen.has(key)) {
        seen.set(key, false)
      } else {
        const counted = seen.get(key)

        if (!counted) {
          count += 1
          seen.set(key, true)
        }
      }

      x += dx
      y += dy
    }
  }

  return count
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput).filter(([x1, y1, x2, y2]: number[]) => {
    return x1 === x2 || y1 === y2
  })

  return count(lines)
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput)

  return count(lines)
}

const exampleInput = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

run({
  part1: {
    tests: [
      { input: exampleInput, expected: 5 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: exampleInput, expected: 12 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
