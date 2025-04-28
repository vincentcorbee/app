import { DirectiveConfig } from '../../types'

export default (): DirectiveConfig => ({
  name: 'form',
  reg: /^(a-|\*)?form/,
  bind(vNode, vm) {
    const self = this
    const { node } = vNode

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
