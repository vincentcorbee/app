export default () => ({
  name: 'form',
  reg: /^(a-|\*)?form/,
  bind(element, vm) {
    const self = this
    const { node } = element

    Reflect.defineProperty(node, '$form', {
      get() {
        return self.attachedData.get(node)
      },
      set(data) {
        self.attachedData.set(node, data)
      },
    })

    node.$form = vm[this.attr.value]

    node.removeAttribute(this.attr.name)
  },
})
