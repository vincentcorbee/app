import { Lexer } from "../types";
import { eatChar } from "./eat-char";
import { hasData } from "./has-data";
import { isLineFeed } from "./is-line-feed";

export function eatSingleLineComment(lexer: Lexer): string
{
  let comment = eatChar(lexer, 2);

  while (hasData(lexer) && !isLineFeed(lexer.source[lexer.index])) comment += eatChar(lexer, 1);

  return comment
}