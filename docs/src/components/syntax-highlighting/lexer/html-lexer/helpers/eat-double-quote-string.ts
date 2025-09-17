import { Lexer } from "../types";
import { eatChar } from "./eat-char";
import { hasData } from "./has-data";

export function eatStringLiteral(lexer: Lexer, type: '"' | "'"): { value: string, error: boolean }
{
  let value = eatChar(lexer);
  let error = false

  accumulator:
  while (hasData(lexer))
  {
    const char = lexer.source[lexer.index]

    switch(char) {
      /* Eat escape sequence */
      case "\\":
      {
        value += eatChar(lexer, 2);
        break
      }
      case type:
        break accumulator;
      case '\n':
      {
        lexer.col = 0;
        lexer.line++;
      }
      default:
        value += eatChar(lexer);
    }
  };

  if (lexer.source[lexer.index] !== type) error = true;

  else value += eatChar(lexer);

  return { value, error }
}