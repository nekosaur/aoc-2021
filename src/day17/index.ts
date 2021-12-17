import run from 'aocrunner'

type TargetArea = [[number, number], [number, number]]

const parseInput = (rawInput: string) => {
  const [x, y] = rawInput.replace('target area: ', '').split(', ')

  return [
    x.replace('x=', '').split('..').map(Number),
    y.replace('y=', '').split('..').map(Number)
  ] as TargetArea
}

const solve = ([targetX, targetY]: TargetArea, [minBound, maxBound]: [number, number]) => {
  const horizontals = []
  for (let initialSpeed = targetX[1]; initialSpeed > 0; initialSpeed--) {
    let position = 0
    for (let currentSpeed = initialSpeed; currentSpeed > 0; currentSpeed--) {
      position += currentSpeed

      if (position >= targetX[0] && position <= targetX[1]) {
        horizontals.push(initialSpeed)
        break;
      }
    }
  }

  const potential = []
  for (let vertical = minBound; vertical < maxBound; vertical++) {
    for (const horizontal of horizontals) {
      const maxY = calculate([horizontal, vertical], [targetX, targetY])

      if (maxY === false) continue

      potential.push([horizontal, vertical, maxY])
    }
  }

  return potential
}

const calculate = ([speedX, speedY]: [number, number], [targetX, targetY]: TargetArea) => {
  let pos = [0, 0]
  let maxY = 0

  while (true) {
    const [x, y] = pos
    pos = [x + speedX, y + speedY]

    if (pos[1] > maxY) maxY = pos[1]

    if (pos[0] >= targetX[0] && pos[0] <= targetX[1] && pos[1] >= targetY[0] && pos[1] <= targetY[1]) {
      return maxY
    }

    if (pos[0] > targetX[1] || pos[1] <= targetY[0]) return false

    speedX = Math.max(0, speedX - 1)
    speedY = speedY - 1
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const potentialStarts = solve(input, [0, 300])

  return Math.max(...potentialStarts.map(([_, __, maxY]) => maxY))
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const potentialStarts = solve(input, [-300, 300])

  return potentialStarts.length
}

run({
  part1: {
    tests: [
      { input: 'target area: x=20..30, y=-10..-5', expected: 45 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: 'target area: x=20..30, y=-10..-5', expected: 112 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
