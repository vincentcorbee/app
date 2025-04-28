//@ts-nocheck
export const createNewElement = (type = null, attributes = null, ns = null) => {
  if (!type) {
    throw new ReferenceError('Type is not supplied')
  }
  let el

  attributes = Array.isArray(attributes) ? attributes : null

  if (ns) {
    el = document.createElementNS(ns[0], type)
  } else if (type === 'documentFragment') {
    el = document.createDocumentFragment()
  } else {
    el = document.createElement(type)
  }

  if (attributes) {
    const boolAttrs = ['disabled', 'required']

    attributes.forEach(keyvalue => {
      const [attribute, value] = keyvalue.split(/=([\S\s]+)?/)

      if (attribute === 'content') {
        el.textContent = value
      } else if (attribute === 'innerHTML') {
        el.innerHTML = value
      } else if (attribute) {
        if (boolAttrs.includes(attribute)) {
          if (value !== 'false' && !!value) {
            el.setAttribute(attribute, '')
          }
        } else {
          el.setAttribute(attribute, value === undefined ? '' : value)
        }
      }
    })
  }

  return el
}

export default createNewElement
