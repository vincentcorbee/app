import { LexerInterface, Token as BaseToken } from '../types'

export type Keyword =
  | 'typeof'
  | 'let'
  | 'const'
  | 'function'
  | 'for'
  | 'while'
  | 'return'
  | 'of'
  | 'break'
  | 'if'
  | 'else'
  | 'import'
  | 'export'
  | 'from'

export type LiteralType = 'true' | 'false' | 'null'

export type TokenType =
  | Keyword
  | (
      | 'identifier'
      | 'number'
      | 'dot'
      | 'comma'
      | 'left_paren'
      | 'right_paren'
      | 'left_brack'
      | 'right_brack'
      | 'left_curl_brace'
      | 'right_curl_brace'
      | 'eof'
      | 'newline'
      | 'ternary'
      | 'colon'
      | 'plus'
      | 'plus_plus'
      | 'min'
      | 'mul'
      | 'mod'
      | 'div'
      | 'assign'
      | 'eq'
      | 'bang'
      | 'bang_bang'
      | 'semi'
      | 'gt'
      | 'lt'
      | 'lt_eq'
      | 'gt_eq'
      | 'and'
      | 'or'
      | 'bin_and'
      | 'bin_or'
      | 'literal'
      | 'newline'
      | 'whitespace'
      | 'error'
      | 'comment'
    )

export type LexerOptions = {
  ignoreWhiteSpace?: boolean
  ignoreNewline?: boolean
  ignoreComments?: boolean
  throws?: boolean
}

export type Lexer = LexerInterface<TokenType, any>

export type Token = BaseToken<TokenType>
