import { LexerInterface, LexerOptions, Token } from './types'

export class Lexer<T, State extends 'initial' | string = 'initial'>
  implements LexerInterface<T, State>
{
  index: number
  line: number
  col: number

  source: string
  throws: boolean
  state: State

  constructor(source: string, options: LexerOptions = {}) {
    this.source = source
    this.throws = options.throws ?? true
    this.state = 'initial' as State
    this.index = 0
    this.line = 1
    this.col = 0
  }

  peek(): Token<T> {
    const { index, col, line, state } = this
    const token = this.next()

    this.index = index
    this.state = state
    this.col = col
    this.line = line

    return token
  }

  lookahead(num: number): Token<T> {
    const index = this.index

    while (num > 0) {
      num--

      this.advance()
    }

    const token = this.next()

    this.index = index

    return token
  }

  expect(tokenType: T): boolean {
    return this.peek().type === tokenType
  }

  advance(): void {
    this.next()
  }

  next(): Token<T> {
    throw Error('Not implemented')
  }

  *[Symbol.iterator]() {
    while (true) {
      const token = this.next()

      if (token.type === 'eof') break

      yield token
    }
  }
}
