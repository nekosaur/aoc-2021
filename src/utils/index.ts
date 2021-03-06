/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

export const range = (length: number, start = 0) => [...Array(length).keys()].map((i) => i + start)

export const transpose = <T>(arr: T[][]) => {
  return range(arr[0].length).map((i) => range(arr.length).map((j) => arr[j][i]))
}

export const zip = <T, U>(a: T[], b: U[]) => {
  const out: [T, U][] = []

  for (let i = 0; i < a.length; i++) {
    out.push([a[i], b[i]])
  }

  return out
}

export function sum(arr: number[]): number
export function sum(arr: bigint[]): bigint
export function sum(arr: bigint[] | number[]): number | bigint {
  if (typeof arr[0] === 'number')
    return (arr as unknown as number[]).reduce((curr, n) => curr + n, 0)
  return (arr as unknown as bigint[]).reduce((curr, n) => curr + n, 0n)
}

function isBigInt(x: any): x is bigint[] {
  return Array.isArray(x) && typeof x[0] === 'bigint'
}

export function minmax(arr: bigint[]): [bigint, bigint]
export function minmax(arr: number[] | bigint[]): [number, number] | [bigint, bigint] {
  if (isBigInt(arr))
    return arr.reduce(([min, max], n) => [n < min ? n : min, n > max ? n : max], [arr[0], arr[0]])
  else
    return arr.reduce(([min, max], n) => [n < min ? n : min, n > max ? n : max], [arr[0], arr[1]])
}

export const union = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a, ...b])

export const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => b.has(x)))

export const difference = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => !b.has(x)))

export const last = <T, U>(gen: Generator<T, U>): U => {
  let next
  while (!(next = gen.next()).done) {}
  return next.value
}

export const valueAt = <T, U>(gen: Generator<T, U>, step: number): T | U => {
  let next = gen.next()
  let value = next.value

  for (let i = 0; i < step - 1; i++) {
    if (next.done) throw new Error('Generator is already finished')

    next = gen.next()
    value = next.value
  }

  return value
}

export const neighbours = (map: number[], i: number, width: number, allowDiagonals = false) => {
  const firstColumn = i % width === 0
  const lastColumn = i % width === width - 1

  let positions: number[] = [i - width, i + width]

  if (!firstColumn) {
    positions.push(i - 1)

    if (allowDiagonals) {
      positions.push(i - width - 1)
      positions.push(i + width - 1)
    }
  }

  if (!lastColumn) {
    positions.push(i + 1)

    if (allowDiagonals) {
      positions.push(i + width + 1)
      positions.push(i - width + 1)
    }
  }

  return positions
    .map((i) => {
      if (map[i] == null) return null

      return [i, i % width, Math.floor(i / width)]
    })
    .filter((x) => !!x) as number[][]
}
