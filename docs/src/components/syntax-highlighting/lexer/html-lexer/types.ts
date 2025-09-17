import { LexerInterface, Token as BaseToken } from '../types'

export type TokenType =
  | 'attribute_name'
  | 'text'
  | 'tag_name'
  | 'newline'
  | 'div'
  | 'eq'
  | 'bang'
  | 'gt'
  | 'lt'
  | 'literal'
  | 'newline'
  | 'whitespace'
  | 'error'
  | 'comment'
  | 'tag_close'

export type Lexer = LexerInterface<TokenType, any>

export type Token = BaseToken<TokenType>
