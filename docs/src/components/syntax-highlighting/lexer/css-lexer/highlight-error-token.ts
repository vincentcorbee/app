import { Token } from './types'

export type TokenLocation = { column: number; line: number }

export function highlightErrorToken(col: number, line: number) {
  return function ({ value }: Token, loc: TokenLocation): string | null {
    if (loc.column - value.length === col && loc.line === line) return value

    return null
  }
}
