import expressionParser from '../helpers/expressionParser'
const parseForExpression = (input, self) => {
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
      }
    },
    {
      type: 'RHS',
      reg: /^[a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*/,
      value: value => expressionParser(self.vm, value, self)
    }
  ]
  let index = 0
  const result = []
  let isLhs = false
  const readToken = () => {
    let curInput = input.substring(index)
    if (curInput.length === 0) {
      return null
    }
    for (let token of tokens) {
      if (Array.isArray(token)) {
        token = {
          type: token[0],
          reg: token[1]
        }
      }
      let curIndex = index
      let reg = token.reg
      let type = token.type
      let match = curInput.match(reg)
      if (reg && type && match) {
        let value = match[0]
        index += value.length
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
          start: curIndex,
          end: index
        }
      }
    }
  }
  let tok = null
  while ((tok = readToken()) !== null) {
    result.push(tok)
  }
  const obj = {
    lhs: null,
    op: null,
    rhs: null
  }
  let ident = result.find(token => token.type === 'RHS') || {}
  if (ident && ident.value) {
    let lhs = result.find(token => token.type === 'LHS')
    if (lhs) {
      obj.rhs = ident
      obj.lhs = {}
      const type = ident.value.constructor.name === 'ArrayMask' ? 'array' : 'object'
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
