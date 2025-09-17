import { Lexer } from "../types";
import { eatChar } from "./eat-char";
import { isLineFeed } from "./is-line-feed";
import { peekAt } from "./peek-at";

export function eatMultiLineComment(lexer: Lexer): string
{
  let comment = eatChar(lexer, 2);

  while (peekAt(lexer, 0) !== '*' && peekAt(lexer, 1) !== '/')
  {
    if (isLineFeed(lexer.source[lexer.index]))
    {
      lexer.line++;
      lexer.col = 1;
    }

    comment += eatChar(lexer, 1);
  }

  comment += eatChar(lexer, 2);

  return comment
}