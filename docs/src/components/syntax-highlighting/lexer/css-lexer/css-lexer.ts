import { Token, TokenType } from './types'
import {
  hasData,
  peekChar,
  tokenCreate,
  eatChar,
  eatNewline,
  eatComment,
  isInteger,
  eatNumber,
  isIdentifierStart,
  eatIdentifer,
  eatStringLiteral,
  peekAt,
  eatWhiteSpace,
} from './helpers'
import { throwError } from '../throw-error'
import { Lexer } from '../lexer'
import { LexerOptions } from '../types'

type State = 'initial' | 'comment'

export class CSSLexer extends Lexer<TokenType, State> {
  ignoreWhiteSpace: boolean

  constructor(source: string, options: LexerOptions = {}) {
    super(source, options)

    this.ignoreWhiteSpace = false
  }

  next(): Token {
    if (!hasData(this))
      return {
        type: 'eof',
        value: '',
      }

    const state = this.state
    const nextChar = peekChar(this)

    switch (state) {
      case 'comment': {
        if (nextChar === '\n') {
          return tokenCreate('newline', eatNewline(this))
        }

        return tokenCreate('comment', eatComment(this))
      }

      default: {
        switch (nextChar) {
          case ' ':
          case '\t':
          case '\r': {
            const value = eatWhiteSpace(this)

            if (this.ignoreWhiteSpace) return this.next()

            return tokenCreate('whitespace', value)
          }
          case '\n': {
            return tokenCreate('newline', eatChar(this))
          }
          case '+': {
            return tokenCreate('plus', eatChar(this))
          }
          case '%':
            return tokenCreate('mod', eatChar(this))
          case '*':
            return tokenCreate('mul', eatChar(this))
          case '/': {
            const peekedChar = peekAt(this, 1)

            if (peekedChar === '*') {
              const comment = eatComment(this)

              return tokenCreate('comment', comment)
            }

            return tokenCreate('div', eatChar(this))
          }
          case '>': {
            return tokenCreate('gt', eatChar(this))
          }
          case '<': {
            return tokenCreate('lt', eatChar(this))
          }
          case '&': {
            return tokenCreate('bin_and', eatChar(this))
          }
          case '|': {
            return tokenCreate('bin_or', eatChar(this))
          }
          case '?':
            return tokenCreate('ternary', eatChar(this))
          case ':':
            return tokenCreate('colon', eatChar(this))
          case ';':
            return tokenCreate('semi', eatChar(this))
          case '(':
            return tokenCreate('left_paren', eatChar(this))
          case ')':
            return tokenCreate('right_paren', eatChar(this))
          case ',':
            return tokenCreate('comma', eatChar(this))
          case '.': {
            if (isInteger(peekAt(this, 1))) {
              return tokenCreate('number', eatChar(this) + eatNumber(this))
            }

            return tokenCreate('dot', eatChar(this))
          }
          case "'":
          case '"': {
            const { value, error } = eatStringLiteral(this, nextChar)

            if (error) {
              if (this.throws)
                throwError(
                  'Unterminated string literal',
                  this.line,
                  this.col,
                  this.index,
                  this.source,
                  this.source[this.index] ?? ''
                )

              return tokenCreate('literal', value, 'Unterminated string literal')
            }

            return tokenCreate('literal', value)
          }
          case '[':
            return tokenCreate('left_brack', eatChar(this))
          case ']':
            return tokenCreate('right_brack', eatChar(this))
          case '{':
            return tokenCreate('left_curl_brace', eatChar(this))
          case '}':
            return tokenCreate('right_curl_brace', eatChar(this))
          case '!':
            return tokenCreate('bang', eatChar(this))

          default:
            if (isInteger(nextChar)) return tokenCreate('number', eatNumber(this))

            if (isIdentifierStart(nextChar)) {
              const value = eatIdentifer(this)

              return tokenCreate('identifier', value)
            }

            return tokenCreate('symbol', eatChar(this))
        }
      }
    }
  }

  *[Symbol.iterator]() {
    while (true) {
      const token = this.next()

      if (token.type === 'eof') break

      yield token
    }
  }
}

// const source = `
// <!DOCTYPE html>
// <html data-mode="dark">
//   <head>
//     <meta charset="utf-8" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//     <title>App</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//   </head>
//   <body>
//     <div id="app" a-cloak>
//       <app-main></app-main>
//     </div>
//   </body>
//   <script type="module" src="app.ts"></script>
// </html>
// `

// const lexer = new HTMLLexer(source)

// let result = ''
// let line = ''

// for (let tok of lexer) {
//   // console.log(tok)
//   switch (tok.type) {
//     case 'newline': {
//       result += `<div class="line">${line}</div>`
//       line = ''
//       break
//     }
//     default: {
//       line += `<span class="${tok.type}">${tok.value}</span>`
//     }
//   }
// }

// if (line) result += `<div class="line">${line}</div>`

// console.log(result)
