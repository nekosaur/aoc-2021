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

export const range = (length: number, start = 0) =>
  [...Array(length).keys()].map((i) => i + start)

export const transpose = <T>(arr: T[][]) => {
  return range(arr[0].length).map((i) =>
    range(arr.length).map((j) => arr[j][i]),
  )
}

export const zip = <T, U>(a: T[], b: U[]) => {
  const out: [T, U][] = []

  for (let i = 0; i < a.length; i++) {
    out.push([a[i], b[i]])
  }

  return out
}

export function sum (arr: number[]): number
export function sum (arr: bigint[]): bigint
export function sum (arr: bigint[] | number[]): number | bigint {
  if (typeof arr[0] === 'number') return (arr as unknown as number[]).reduce((curr, n) => curr + n, 0)
  return (arr as unknown as bigint[]).reduce((curr, n) => curr + n, 0n)
}