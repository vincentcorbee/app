import { DirectiveConfig } from '../../types'

export default (): DirectiveConfig => ({
  name: 'ref',
  reg: /^(a-|\*)?ref/,
  bind(vNode, vm) {
    vm.$refs = {
      ...vm.$refs,
      [this.attr.value]: vNode.node,
    }

    vNode.node.removeAttribute(this.attr.name)
  },
})
