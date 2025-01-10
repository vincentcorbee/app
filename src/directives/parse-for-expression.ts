//@ts-nocheck
import expressionParser from '../parser/expression-parser'

const tokens = [
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
    value: (value, directive) => {
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

const parseForExpression = (input, directive) => {
  let end = 0
  let isLhs = false
  let tok = null

  const parsedTokens = []

  const readToken = () => {
    const curInput = input.substring(end)

    if (curInput.length === 0) return null

    for (let token of tokens) {
      if (Array.isArray(token))
        token = {
          type: token[0],
          reg: token[1],
        }

      const start = end
      const { reg, type } = token
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

        if (typeof token.value === 'function') value = token.value(value, directive)

        return {
          type,
          reg,
          value,
          start,
          end,
        }
      }
    }
  }

  while ((tok = readToken()) !== null) parsedTokens.push(tok)

  const result = {
    lhs: null,
    op: null,
    rhs: null,
  }
  const identifier = parsedTokens.find(token => token.type === 'RHS') || {}

  if (identifier && identifier.value.result) {
    const { result: value } = identifier.value
    const lhs = parsedTokens.find(token => token.type === 'LHS')

    if (lhs) {
      result.rhs = identifier
      result.lhs = {}

      const type =
        value.constructor.name === 'ArrayMask' || Array.isArray(value)
          ? 'array'
          : 'object'
      const args = lhs.value

      args.forEach((arg, i) => {
        if (type === 'array') {
          if (i === 0) {
            result.lhs.alias = arg
          } else if (i === 1) {
            result.lhs.index = arg
          }
        } else {
          if (i === 0) {
            result.lhs.value = arg
          } else if (i === 1) {
            result.lhs.key = arg
          } else if (i === 2) {
            result.lhs.index = arg
          }
        }
      })
    }

    result.op = parsedTokens.find(token => token.type === 'OP') || {}
  }

  return result
}

export default parseForExpression
