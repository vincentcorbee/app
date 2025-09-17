export type TokenType<T> = 'eof' | T

export type Token<T = unknown> = {
  value: string
  type: TokenType<T>
  error?: string
}

export type ErrorToken = {
  error: string
  token: 'error'
} & Token

export type LexerInterface<T, S> = {
  index: number
  source: string
  col: number
  line: number
  state: S
  peek(): Token
  lookahead(num: number): Token
  expect(tokenType: TokenType<T>): boolean
  advance(): void
  next(): Token
  [Symbol.iterator](): Iterator<Token<T>>
}

export type LexerOptions = {
  throws?: boolean
  ignoreComments?: boolean
}

export type Lexer<T, S> = LexerInterface<T, S>
