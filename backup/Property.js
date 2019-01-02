import getPlaceholders from '../helpers/getPlaceholders'
let _privateProperty = new WeakMap()
export default class Property {
  constructor({ value, node, orgNode, identifier, vm } = {}) {
    _privateProperty.set(this, {
      value: value !== undefined && value !== null
        ? value
        : null,
      node: node || null,
      orgNode: orgNode || null,
      identifier,
      vm
    })
  }
  get node() {
    return _privateProperty.get(this).node
  }
  set node(node) {
    _privateProperty.get(this).node = node
    return this
  }
  get value() {
    return _privateProperty.get(this).value
  }
  set value(value) {
    let { node, orgNode, identifier, vm } = _privateProperty.get(this)
    _privateProperty.get(this).value = value
    if (node) {
      let clone = orgNode.cloneNode(true)
      let placeholders = getPlaceholders(clone)
      placeholders.forEach(placeholder => {
        if ((identifier) === placeholder.replace(/[{{ *}}]/g, '')) {
          clone.data = clone.data
            .split(placeholder)
            .join(value)
        } else {
          let path = placeholder.replace(/[{{ *}}]/g, '').split('.')
          const getValue = (path, data) => {
            data = data[path.shift()]
            if (path.length) {
              return getValue(path, data)
            } else {
              return data
            }
          }
          const value = getValue(path, vm)
          if (value) {
            clone.data = clone.data
              .split(placeholder)
              .join(value)
          }
        }
      })
      node.parentNode.replaceChild(clone, node)
      this.node = clone
    }
    return this
  }
}
