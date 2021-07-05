import expressionParser from '../helpers/expressionParser'

const parseForExpression = (input, self) => {
  let end = 0
  let isLhs = false
  let tok = null

  const tokens = [
    ['IGNORE', /^[ \t\v\r]+/],
    ['OP', /^in|of/],
    {
      type: 'LHS',
      reg: /^\((?:[a-z, A-Z]+)\)|[a-zA-Z]+/,
      value: value => {
        if (value.indexOf('(') === 0) {
          return value
            .substring(1, value.length - 1)
            .split(',')
            .map(val => val.trim())
        }
        return [value]
      },
    },
    {
      type: 'RHS',
      reg: /^([a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*)|\[.*\]/,
      value: value => {
        try {
          return JSON.parse(value)
        } catch (e) {
          return expressionParser(self.vm, value, self)
        }
      },
    },
  ]
  const result = []
  const readToken = () => {
    const curInput = input.substring(end)

    if (curInput.length === 0) {
      return null
    }

    for (let token of tokens) {
      if (Array.isArray(token)) {
        token = {
          type: token[0],
          reg: token[1],
        }
      }

      const start = end
      const reg = token.reg
      const type = token.type
      const match = curInput.match(reg)

      if (reg && type && match) {
        let value = match[0]

        end += value.length

        if (type === 'LHS') {
          if (isLhs) {
            continue
          } else {
            isLhs = true
          }
        } else if (type === 'RHS' && isLhs) {
          isLhs = false
        }

        if (type === 'IGNORE') {
          return readToken()
        }

        if (typeof token.value === 'function') {
          value = token.value(value)
        }

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

  while ((tok = readToken()) !== null) {
    result.push(tok)
  }

  const obj = {
    lhs: null,
    op: null,
    rhs: null,
  }

  const ident = result.find(token => token.type === 'RHS') || {}

  if (ident && ident.value) {
    const lhs = result.find(token => token.type === 'LHS')

    if (lhs) {
      obj.rhs = ident
      obj.lhs = {}

      const type =
        ident.value.constructor.name === 'ArrayMask' || Array.isArray(ident.value)
          ? 'array'
          : 'object'
      const args = lhs.value

      args.forEach((arg, i) => {
        if (type === 'array') {
          if (i === 0) {
            obj.lhs.alias = arg
          } else if (i === 1) {
            obj.lhs.index = arg
          }
        } else {
          if (i === 0) {
            obj.lhs.value = arg
          } else if (i === 1) {
            obj.lhs.key = arg
          } else if (i === 2) {
            obj.lhs.index = arg
          }
        }
      })
    }

    obj.op = result.find(token => token.type === 'OP') || {}
  }

  return obj
}

export default parseForExpression
