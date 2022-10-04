const isType = (type, obj) => {
  let value

  switch (type.toLowerCase()) {
    case 'function':
      value = 'Function'
      break
    case 'array':
      value = 'Array'
      break
    case 'object':
      value = 'Object'
      break
    case 'string':
      value = 'String'
      break
    case 'boolean':
      value = 'Boolean'
      break
    case 'documentfragment':
      value = 'DocumentFragment'
      break
    case 'shadowroot':
      value = 'ShadowRoot'
      break
    case 'node':
      if (!obj || !obj.nodeType) {
        return false
      }

      value = Object.prototype.toString.call(obj).match(/[^\s\]]+(?=])/)[0]

      break
    default:
      throw new TypeError(type + ' is not a recognized type')
  }

  return Object.prototype.toString.call(obj) === '[object ' + value + ']'
}

export default isType
