import { Lexer } from "../types";
import { eatChar } from "./eat-char";
import { eatInteger } from "./eat-integer";
import { isDot } from "./is-dot";

export function eatNumber(lexer: Lexer): string
{
  let value = ''

  const { source } = lexer

  value = eatInteger(lexer)

  if (isDot(source[lexer.index] ?? '')) value += eatChar(lexer) + eatInteger(lexer)

  return value;
}