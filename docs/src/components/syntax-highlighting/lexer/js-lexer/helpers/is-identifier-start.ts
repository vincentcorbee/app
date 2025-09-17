import { isAsciiAz } from "./is-ascii-az";

export function isIdentifierStart(char: string): boolean
{
  return isAsciiAz(char) || char === '$';
}