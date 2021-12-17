import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('').flatMap(hex => parseInt(hex, 16).toString(2).padStart(4, '0').split('').map(c => Number(c)))

enum Type {
  SUM_OPERATOR = 0,
  PRODUCT_OPERATOR = 1,
  MIN_OPERATOR = 2,
  MAX_OPERATOR = 3,
  LITERAL_VALUE = 4,
  GREATER_THAN_OPERATOR = 5,
  LESS_THAN_OPERATOR = 6,
  EQUAL_OPERATOR = 7,
}

enum LengthType {
  TOTAL_LENGTH = 0,
  NUM_PACKETS = 1,
}

type ValuePacket = {
  version: number
  type: Type.LITERAL_VALUE
  length: number
  value: number
}

type OperatorPacket<T> = {
  version: number
  type: T
  length: number
  subPackets: Packet[]
}

type Packet = 
  | ValuePacket
  | OperatorPacket<Type.SUM_OPERATOR>
  | OperatorPacket<Type.PRODUCT_OPERATOR>
  | OperatorPacket<Type.MIN_OPERATOR>
  | OperatorPacket<Type.MAX_OPERATOR>
  | OperatorPacket<Type.GREATER_THAN_OPERATOR>
  | OperatorPacket<Type.LESS_THAN_OPERATOR>
  | OperatorPacket<Type.EQUAL_OPERATOR>

const read = (packet: number[], length: number) => parseInt(packet.splice(0, length).join(''), 2)

const decodePacket = (packet: number[]): Packet => {
  const packetLength = packet.length 
  const version = read(packet, 3)
  const type = read(packet, 3)

  if (type === Type.LITERAL_VALUE) {
    let group = packet.splice(0, 5)
    let value = []
    while (group[0] === 1) {
      value.push(...group.slice(1))
      group = packet.splice(0, 5)
    }
    value.push(...group.slice(1))
    return { version, type, value: read(value, value.length), length: packetLength - packet.length }
  } else {
    const lengthType = read(packet, 1)
    const subPackets = []

    if (lengthType === LengthType.TOTAL_LENGTH) {
      let length = read(packet, 15)
      
      while (length > 0) {
        const subPacket = decodePacket(packet)
        length = length - subPacket.length
        subPackets.push(subPacket)
      }
    } else if (lengthType === LengthType.NUM_PACKETS) {
      let numPackets = read(packet, 11)
      while (numPackets > 0) {
        const subPacket = decodePacket(packet)
        numPackets -= 1
        subPackets.push(subPacket)
      }
    }

    return { version, type, subPackets, length: packetLength - packet.length }
  }
}

const countVersions = (packet: Packet, versions = 0): number => {
  if (packet.type === Type.LITERAL_VALUE) return versions + packet.version

  return versions + packet.subPackets.reduce((curr, subPacket) => curr + countVersions(subPacket, 0), packet.version)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const packets = decodePacket([...input])

  return countVersions(packets)
}

const solveExpression = (packet: Packet): number => {
  switch (packet.type) {
    case Type.SUM_OPERATOR: {
      return packet.subPackets.reduce((sum, subPacket) => sum + solveExpression(subPacket), 0)
    }
    case Type.PRODUCT_OPERATOR: {
      return packet.subPackets.reduce((sum, subPacket) => sum * solveExpression(subPacket), 1)
    }
    case Type.MIN_OPERATOR: {
      return Math.min(...packet.subPackets.map(subPacket => solveExpression(subPacket)))
    }
    case Type.MAX_OPERATOR: {
      return Math.max(...packet.subPackets.map(subPacket => solveExpression(subPacket)))
    }
    case Type.GREATER_THAN_OPERATOR: {
      const [a, b] = packet.subPackets.map(subPacket => solveExpression(subPacket))
      return a > b ? 1 : 0
    }
    case Type.LESS_THAN_OPERATOR: {
      const [a, b] = packet.subPackets.map(subPacket => solveExpression(subPacket))
      return a < b ? 1 : 0
    }
    case Type.EQUAL_OPERATOR: {
      const [a, b] = packet.subPackets.map(subPacket => solveExpression(subPacket))
      return a === b ? 1 : 0
    }
    case Type.LITERAL_VALUE: {
      return packet.value
    }
    default: throw new Error('Foo')
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const packets = decodePacket(input)

  return solveExpression(packets)
}

run({
  part1: {
    tests: [
      { input: 'D2FE28', expected: 6 },
      { input: '38006F45291200', expected: 9 },
      { input: '8A004A801A8002F478', expected: 16 },
      { input: '620080001611562C8802118E34', expected: 12 },
      { input: 'C0015000016115A2E0802F182340', expected: 23 },
      { input: 'A0016C880162017C3686B18A3D4780', expected: 31 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: 'C200B40A82', expected: 3 },
      { input: '04005AC33890', expected: 54 },
      { input: '880086C3E88112', expected: 7 },
      { input: 'CE00C43D881120', expected: 9 },
      { input: 'D8005AC2A8F0', expected: 1 },
      { input: 'F600BC2D8F', expected: 0 },
      { input: '9C005AC2F8F0', expected: 0 },
      { input: '9C0141080250320F1802104A08', expected: 1 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
