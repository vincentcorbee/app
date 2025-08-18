import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (expressionParser: ExpressionParser): DirectiveConfig => ({
  name: 'text',
  reg: /(?:{{.*?\}})|(?:^(a-|\*)text)/,
  bind(vNode) {
    const placeholder = this.attr.placeholder

    this.vNode = vNode
    this.orgNode = vNode.node.cloneNode(true)
    this.placeholder = placeholder

    this.update()
  },
  update() {
    const { vNode } = this

    if (vNode) {
      const { node } = vNode
      const parent = node.parentNode

      if (node && parent) {
        const { placeholder, expression, vm, orgNode } = this
        const clone = orgNode.cloneNode(true)
        const value = expressionParser(vm, expression, this)
        const nodeValue = clone.data.split(placeholder.value).join(value ?? '')

        if (node.data === nodeValue) return

        clone.data = nodeValue

        vNode.node = clone

        parent.replaceChild(clone, node)
      }
    }
  },
})
