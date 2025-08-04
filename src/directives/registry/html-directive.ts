import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'html',
  reg: /^(a-|\*)?html/,
  bind(vNode, vm) {
    const { node } = vNode
    const value = expressionParser(vm, this.attr.value, this)

    this.vNode = vNode
    this.orgNode = node.cloneNode(true)

    node.removeAttribute(this.attr.name)

    this.update({
      type: 'set',
      value,
    })
  },
  update(data) {
    const { vNode } = this

    if (vNode.node) {
      const placeholder = this.identifier

      if (data.value !== undefined) vNode.node.innerHTML = data.value
    }
  },
})
