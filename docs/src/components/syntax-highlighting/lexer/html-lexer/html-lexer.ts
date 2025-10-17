import { Token, TokenType } from './types'
import {
  hasData,
  peekChar,
  eatWhiteSpace,
  tokenCreate,
  eatChar,
  peekAt,
  eatStringLiteral,
  isTagNameStart,
  eatTagName,
  eatNewline,
  eatComment,
  isAttributeStart,
} from './helpers'
import { throwError } from '../throw-error'
import { eatAttributeName } from './helpers/eat-attribute-name'
import { Lexer } from '../lexer'
import { LexerOptions } from '../types'

type State =
  | 'startTagOpen'
  | 'endTagOpen'
  | 'attribute'
  | 'initial'
  | 'tag'
  | 'inTag'
  | 'doctype'
  | 'comment'
  | 'inComment'

export class HTMLLexer extends Lexer<TokenType, State> {
  constructor(source: string, options: LexerOptions = {}) {
    super(source, options)

    this.state = 'initial'
  }

  next(): Token {
    if (!hasData(this)) {
      return {
        type: 'eof',
        value: '',
      }
    }

    const state = this.state
    const nextChar = peekChar(this)

    switch (state) {
      case 'initial': {
        let text = ''

        if (nextChar === '\n') {
          return tokenCreate('newline', eatNewline(this))
        }

        while (hasData(this)) {
          const char = peekChar(this)

          if (char === '<') {
            this.state = 'tag'

            break
          }

          if (char === '\n') {
            break
          }

          text += eatChar(this)
        }

        return tokenCreate('text', text)
      }
      case 'comment': {
        return tokenCreate('comment', eatComment(this))
      }
      case 'inComment': {
        if (nextChar === '\n') {
          return tokenCreate('newline', eatNewline(this))
        }

        return tokenCreate('comment', eatComment(this))
      }
      case 'startTagOpen': {
        if (isTagNameStart(nextChar)) {
          const value = eatTagName(this)

          this.state = 'inTag'

          return tokenCreate('tag_name', value)
        }

        break
      }
      case 'endTagOpen': {
        switch (nextChar) {
          case '/': {
            return tokenCreate('div', eatChar(this))
          }
          default: {
            if (isTagNameStart(nextChar)) {
              const value = eatTagName(this)

              this.state = 'inTag'

              return tokenCreate('tag_name', value)
            }
          }
        }

        break
      }
      case 'inTag': {
        switch (nextChar) {
          case ' ':
          case '\t':
          case '\r': {
            const value = eatWhiteSpace(this)

            return tokenCreate('whitespace', value)
          }
          case '\n': {
            const value = eatNewline(this)

            return tokenCreate('newline', value)
          }
          case '/': {
            return tokenCreate('div', eatChar(this))
          }
          case '=': {
            this.state = 'attribute'

            return tokenCreate('eq', eatChar(this))
          }
          case '>': {
            this.state = 'initial'

            return tokenCreate('gt', eatChar(this))
          }
          case "'":
          case '"': {
            const { value, error } = eatStringLiteral(this, nextChar)

            if (error) {
              if (this.throws) {
                throwError(
                  'Unterminated string literal',
                  this.line,
                  this.col,
                  this.index,
                  this.source,
                  this.source[this.index] ?? ''
                )
              }

              return tokenCreate('error', value, 'Unterminated string literal')
            }

            return tokenCreate('literal', value)
          }
          default: {
            if (isAttributeStart(nextChar)) {
              const value = eatAttributeName(this)

              this.state = 'attribute'

              return tokenCreate('attribute_name', value)
            }
          }
        }

        break
      }
      case 'attribute': {
        switch (nextChar) {
          case "'":
          case '"': {
            const { value, error } = eatStringLiteral(this, nextChar)

            if (error) {
              if (this.throws) {
                throwError(
                  'Unterminated string literal',
                  this.line,
                  this.col,
                  this.index,
                  this.source,
                  this.source[this.index] ?? ''
                )
              }

              return tokenCreate('error', value, 'Unterminated string literal')
            }

            return tokenCreate('literal', value)
          }
        }

        this.state = 'inTag'

        return this.next()
      }
      case 'doctype': {
        switch (nextChar) {
          case '!': {
            this.state = 'startTagOpen'

            return tokenCreate('bang', eatChar(this))
          }
        }

        break
      }
      default: {
        switch (nextChar) {
          case '<': {
            const nextChar = peekAt(this, 1)

            if (nextChar === '!' && peekAt(this, 2) === '-' && peekAt(this, 2) === '-') {
              this.state = 'comment'

              return this.next()
            }

            if (nextChar === '!') this.state = 'doctype'
            else if (nextChar === '/') this.state = 'endTagOpen'
            else this.state = 'startTagOpen'

            return tokenCreate('lt', eatChar(this))
          }
        }
      }
    }

    const errorMessage = `Lexer: Invalid syntax "${this.source[this.index]}"`

    if (this.throws) {
      throwError(errorMessage, this.line, this.col, this.index, this.source, nextChar)
    } else {
      return tokenCreate('error', eatChar(this), errorMessage)
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
