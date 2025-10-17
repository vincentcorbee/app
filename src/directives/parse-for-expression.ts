import { Directive } from '../modules'
import expressionParser from '../parser/expression-parser'

type Token = {
  type: string
  reg: RegExp
  value: any
  start: number
  end: number
}

type GrammarRuleObject = {
  type: string
  reg: RegExp
  value?: (value: string, directive: Directive) => any
}

type GrammarRuleArray = [string, RegExp]

type GrammarRule = GrammarRuleObject | GrammarRuleArray

type Lhs = {
  alias?: any
  index?: any
  key?: any
  value?: any
}

type Result = {
  lhs: null | Lhs
  op: null | Token
  rhs: null | Token
}

const GRAMMAR: Array<GrammarRule> = [
  ['IGNORE', /^[ \t\v\r]+/],
  ['OP', /^(in|of)/],
  {
    type: 'LHS',
    reg: /^\((?:[a-z, A-Z]+)\)|[a-zA-Z]+/,
    value: value => {
      if (value.indexOf('(') === 0)
        return value
          .substring(1, value.length - 1)
          .split(',')
          .map(val => val.trim())

      return [value]
    },
  },
  {
    type: 'RHS',
    reg: /^([a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*)|\[.*\]/,
    value: (value, directive: Directive) => {
      let result

      try {
        result = JSON.parse(value)
      } catch (e) {
        result = expressionParser(directive.vm, value, directive)
      } finally {
        return {
          result,
          raw: value,
        }
      }
    },
  },
]

const parseForExpression = (input: string, directive: Directive) => {
  let end = 0
  let isLhs = false
  let token = null

  const parsedTokens: Array<Token> = []

  const readToken = (): Token | null => {
    const curInput = input.substring(end)

    if (curInput.length === 0) return null

    const length = GRAMMAR.length

    for (let i = 0; i < length; i++) {
      let rule = GRAMMAR[i]

      if (Array.isArray(rule)) {
        rule = {
          type: rule[0],
          reg: rule[1],
        }
      }

      const start = end
      const { reg, type } = rule as GrammarRuleObject
      const match = curInput.match(reg)

      if (reg && type && match) {
        let value = match[0]

        end += value.length

        if (type === 'LHS') {
          if (isLhs) continue
          else isLhs = true
        } else if (type === 'RHS' && isLhs) {
          isLhs = false
        }

        if (type === 'IGNORE') return readToken()

        if (typeof rule.value === 'function') value = rule.value(value, directive)

        return {
          type,
          reg,
          value,
          start,
          end,
        }
      }
    }

    return null
  }

  while ((token = readToken()) !== null) parsedTokens.push(token)

  const result: Result = {
    lhs: null,
    op: null,
    rhs: null,
  }
  const identifier = parsedTokens.find(token => token.type === 'RHS')

  if (identifier && identifier.value.result) {
    const { result: value } = identifier.value
    const tokenLhs = parsedTokens.find(token => token.type === 'LHS')

    if (tokenLhs) {
      result.rhs = identifier

      const lhs: Lhs = {}

      const type =
        value.constructor.name === 'ArrayMask' || Array.isArray(value)
          ? 'array'
          : 'object'
      const args = tokenLhs.value as Array<any>

      args.forEach((arg, i) => {
        if (type === 'array') {
          if (i === 0) {
            lhs.alias = arg
          } else if (i === 1) {
            lhs.index = arg
          }
        } else {
          if (i === 0) {
            lhs.value = arg
          } else if (i === 1) {
            lhs.key = arg
          } else if (i === 2) {
            lhs.index = arg
          }
        }
      })

      result.lhs = lhs
    }

    result.op = parsedTokens.find(token => token.type === 'OP') ?? null
  }

  return result
}

export default parseForExpression
