import { defineComponent } from '@digitalbranch/app'

import template from './syntax-highlighting.html'
import css from './syntax-highlighting.css'
import { CSSLexer, HTMLLexer, JSLexer } from './lexer'
import { Token } from './lexer/types'

export const syntaxHighlighting = defineComponent({
  name: 'syntax-highlighting',
  props: [{ name: 'language', type: 'string', required: true }],
  css,
  template,
  data() {
    return {
      isCopied: false,
    }
  },
  methods: {
    onSlotChange() {
      this.highlight()
    },
    highlightJS(source: string) {
      const lexer = new JSLexer(source, {
        ignoreComments: false,
        ignoreNewline: false,
        ignoreWhiteSpace: false,
      })
      const code = this.$refs.code as HTMLDivElement

      let result = ''
      let line = ''
      let prevToken: Token | null = null

      for (const token of lexer) {
        const { type, value } = token

        lexer.ignoreWhiteSpace = true

        const nextToken = lexer.peek()

        lexer.ignoreWhiteSpace = false

        switch (type) {
          case 'newline': {
            result += `<div class="line">${line}</div>`
            line = ''

            break
          }
          case 'identifier': {
            if (nextToken.type === 'left_paren') {
              line += `<span class="function_call">${value}</span>`
            } else if (prevToken && prevToken.type === 'dot') {
              line += `<span class="member">${value}</span>`
            } else if (nextToken && nextToken.type !== 'colon' && value === 'this') {
              line += `<span class="this">${value}</span>`
            } else {
              line += `<span class="${type}">${value}</span>`
            }

            break
          }
          case 'assign':
          case 'plus_plus':
          case 'plus':
          case 'min':
          case 'mul':
          case 'div':
          case 'lt':
          case 'gt':
          case 'gt_eq':
          case 'lt_eq':
          case 'bin_and':
          case 'bin_or':
          case 'and':
          case 'or':
          case 'bang':
          case 'bang_bang':
          case 'typeof': {
            line += `<span class="operator">${value}</span>`

            break
          }
          case 'literal': {
            switch (true) {
              case value.startsWith('"'):
              case value.startsWith("'"):
              case value.startsWith('`'): {
                const quote = value[0]

                line += `<span class="quote">${quote}</span><span class="string_literal">${value.slice(
                  1,
                  value.length - 1
                )}</span><span class="quote">${quote}</span>`

                break
              }
              default:
                line += `<span class="${type}">${value}</span>`
            }

            break
          }
          default: {
            line += `<span class="${type}">${value}</span>`
          }
        }

        if (type !== 'whitespace') prevToken = token
      }

      if (line) result += `<div class="line">${line}</div>`

      code.innerHTML = result
    },
    highlightHTML(source: string) {
      const lexer = new HTMLLexer(source)
      const code = this.$refs.code as HTMLDivElement

      let result = ''
      let line = ''

      for (const token of lexer) {
        const { type, value } = token

        switch (type) {
          case 'newline': {
            result += `<div class="line">${line}</div>`
            line = ''

            break
          }
          case 'div': {
            if (lexer.peek().type === 'gt') {
              line += `<span class="tag_close">${value}</span>`
            } else line += `<span class="${type}">${value}</span>`

            break
          }
          case 'comment': {
            line += `<span class="${type}">${value
              .replace('<', '&lt;')
              .replace('>', '&gt;')}</span>`

            break
          }
          case 'literal': {
            switch (true) {
              case value.startsWith('"'):
              case value.startsWith("'"):
              case value.startsWith('`'): {
                const quote = value[0]

                line += `<span class="quote">${quote}</span><span class="string_literal">${value.slice(
                  1,
                  value.length - 1
                )}</span><span class="quote">${quote}</span>`

                break
              }
              default:
                line += `<span class="${type}">${value}</span>`
            }

            break
          }
          default: {
            line += `<span class="${type}">${value}</span>`
          }
        }
      }

      if (line) result += `<div class="line">${line}</div>`

      code.innerHTML = result
    },
    highlightCSS(source: string) {
      const lexer = new CSSLexer(source)
      const code = this.$refs.code as HTMLDivElement

      let level = 0
      let state: 'initial' | 'inBlock' | 'declaration' = 'initial'
      let result = ''
      let line = ''
      let prevToken: Token | null = null

      for (const token of lexer) {
        const { type, value } = token

        switch (state) {
          case 'declaration': {
          }
          default: {
            switch (type) {
              case 'newline': {
                result += `<div class="line">${line}</div>`
                line = ''

                break
              }
              case 'colon': {
                const nextToken = lexer.peek()

                line += `<span class="html_${type}">${value}</span>`

                if (nextToken.type === 'identifier') {
                  line += `<span class="html_pseudo_selector">${
                    lexer.next().value
                  }</span>`
                }

                break
              }
              case 'dot': {
                const nextToken = lexer.peek()

                line += `<span class="html_${type}">${value}</span>`

                if (nextToken.type === 'identifier') {
                  line += `<span class="html_class">${lexer.next().value}</span>`
                }

                break
              }
              case 'semi': {
                state = level > 0 ? 'inBlock' : 'initial'

                line += `<span class="html_${type}">${value}</span>`

                break
              }
              case 'left_curl_brace': {
                level++

                state = 'inBlock'

                line += `<span class="html_${type}">${value}</span>`

                break
              }
              case 'right_curl_brace': {
                if (level > 0) level--
                if (level === 0) state = 'initial'

                line += `<span class="html_${type}">${value}</span>`

                break
              }
              case 'identifier': {
                lexer.ignoreWhiteSpace = true

                const nextToken = lexer.peek()

                lexer.ignoreWhiteSpace = false

                if (nextToken.type === 'colon') {
                  state = 'declaration'

                  line += `<span class="html_property_name">${value}</span>`
                } else if (prevToken?.type === 'colon') {
                  line += `<span class="html_literal">${value}</span>`
                } else {
                  line += `<span class="html_${type}">${value}</span>`
                }

                break
              }
              default: {
                line += `<span class="html_${type}">${value}</span>`
              }
            }
          }
        }

        if (type !== 'whitespace') prevToken = token
      }

      if (line) result += `<div class="line">${line}</div>`

      code.innerHTML = result
    },
    highlight() {
      const language = this.language
      const source = this.$node?.querySelector('textarea') as HTMLTextAreaElement

      if (!source) return

      if (language === 'html') this.highlightHTML(source.value.trim())
      else if (language === 'js') this.highlightJS(source.value.trim())
      else if (language === 'css') this.highlightCSS(source.value.trim())
    },
    async copy() {
      const source = this.$node?.querySelector('textarea') as HTMLTextAreaElement

      if (!source) return

      await navigator.clipboard.writeText(source.value)

      this.isCopied = true

      setTimeout(() => {
        this.isCopied = false
      }, 1000)
    },
  },
  listeners: {
    attributeChanged() {
      this.highlight()
    },
  },
})
