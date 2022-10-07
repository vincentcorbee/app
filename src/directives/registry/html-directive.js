import mapToKeys from '../mapToKeys'

export default () => ({
  name: 'html',
  reg: /^(a-|\*)?html/,
  bind(element, vm) {
    const self = this
    const node = element.node
    const identifier = this.attr.value
    const value = getValue(vm.data, {
      placeholder: identifier,
      identifiers: mapToKeys(identifier).keys,
    })

    self.element = element
    self.orgNode = node.cloneNode(true)
    self.identifier = identifier

    node.removeAttribute(this.attr.name)

    if (value.value !== undefined) {
      value.data.__observable__.subscribe(self, value.key)

      self.update({
        value: value.value,
      })
    }
  },
  update() {
    const self = this

    if (self.element.node) {
      const element = self.element
      const placeholder = self.identifier
      const value = getValue(self.vm.data, {
        placeholder,
        identifiers: mapToKeys(placeholder).keys,
      })

      if (value.value !== undefined) {
        element.node.innerHTML = value.value
      }
    }
  },
})
