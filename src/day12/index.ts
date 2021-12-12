import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').reduce(([nodes, children], path) => {
  const [start, end] = path.split('-')

  nodes.add(start)
  nodes.add(end)

  const startChildren = children.get(start)
  children.set(start, startChildren ? [...startChildren, end] : [end])

  const endChildren = children.get(end)
  children.set(end, endChildren ? [...endChildren, start] : [start])

  return [nodes, children] as [Set<string>, Map<string, string[]>]
}, [new Set<string>(), new Map<string, string[]>()] as [Set<string>, Map<string, string[]>])

const part1 = (rawInput: string) => {
  const [_, children] = parseInput(rawInput)
  const paths: string[][] = []

  function dfs (path: string[], current: string, visited: Set<string>) {
    if (current === 'end') {
      paths.push(path)
      return
    }

    for (const n of children.get(current) ?? []) {
      if (visited.has(n)) continue

      const v = new Set(visited)
      if (n.toLowerCase() === n) {
        v.add(n)
      }

      dfs([...path, n], n, v)
    }
  }

  dfs(['start'], 'start', new Set(['start']))

  return paths.length
}

const part2 = (rawInput: string) => {
  const [_, children] = parseInput(rawInput)
  const paths: string[][] = []

  function dfs (path: string[], current: string, visited: Set<string>, small: Set<string>, flipped: boolean) {
    if (current === 'end') {
      paths.push(path)
      return
    }

    for (const n of children.get(current) ?? []) {
      if (visited.has(n)) continue

      const v = new Set(visited)
      const s = new Set(small)
      let f = flipped
      if (n.toLowerCase() === n) {
        if (f) {
          v.add(n)
        } else if (!s.has(n)) {
          s.add(n)
        } else {
          f = true
          ;[...s].forEach(n => v.add(n))
        }
      }

      dfs([...path, n], n, v, s, f)
    }
  }

  dfs(['start'], 'start', new Set(['start']), new Set(), false)

  return paths.length
}

const examples: string[] = [`
start-A
start-b
A-c
A-b
b-d
A-end
b-end`, `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`, `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`]

run({
  part1: {
    tests: [
      { input: examples[0], expected: 10 },
      { input: examples[1], expected: 19 },
      { input: examples[2], expected: 226 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: examples[0], expected: 36 },
      { input: examples[1], expected: 103 },
      { input: examples[2], expected: 3509 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
})
