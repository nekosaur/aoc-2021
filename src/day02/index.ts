import run from 'aocrunner'

type Direction = 'up' | 'down' | 'forward'

type Step = [Direction, number]

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const [direction, units] = line.split(' ')
    return [direction, Number(units)] as Step
  })

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const position = input.reduce(
    ({ y, z }, step) => {
      const [direction, units] = step

      switch (direction) {
        case 'up':
          return { y, z: z - units }
        case 'down':
          return { y, z: z + units }
        case 'forward':
          return { y: y + units, z }
        default:
          return { y, z }
      }
    },
    { y: 0, z: 0 },
  )

  return position.y * position.z
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const position = input.reduce(
    ({ y, z, aim }, step) => {
      const [direction, units] = step

      switch (direction) {
        case 'up':
          return { y, z, aim: aim - units }
        case 'down':
          return { y, z, aim: aim + units }
        case 'forward':
          return { y: y + units, z: z + aim * units, aim }
        default:
          return { y, z, aim }
      }
    },
    { y: 0, z: 0, aim: 0 },
  )

  return position.y * position.z
}

const exampleInput = `
forward 5
down 5
forward 8
up 3
down 8
forward 2`

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
