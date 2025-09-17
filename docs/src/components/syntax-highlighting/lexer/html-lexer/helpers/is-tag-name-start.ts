import { isAsciiAz } from './is-ascii-az'

export function isTagNameStart(char: string): boolean {
  return isAsciiAz(char)
}
