import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'show',
  reg: /^(a-|\*)show/,
  bind(vNode) {
    this.vNode = vNode
    this.expression = this.attr.value

    const { node } = vNode

    node.removeAttribute(this.attr.name)

    this.update()
  },
  update() {
    const { expression, vm, vNode } = this
    const value = expressionParser(vm, expression, this)

    vNode.node.setAttribute('aria-hidden', !value)
  },
})
