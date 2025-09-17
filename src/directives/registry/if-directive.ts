import insertCase from '../insert-case'
import getCases from '../get-cases'
import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'if',
  reg: /^(a-|\*)if/,
  bind(vNode) {
    const {
      attr: { name, value },
    } = this
    const { node } = vNode
    const { parentNode } = node
    const index = parentNode
      ? Array.prototype.indexOf.call(parentNode.childNodes, node)
      : 0

    node.removeAttribute(name)

    this.cases = getCases(
      {
        index,
        vNode: null,
        parentNode,
        orgNode: node.cloneNode(true),
        identifier: value,
      },
      node
    )
    this.vNode = vNode

    this.update()
  },
  update() {
    const { cases, vm, attr } = this
    const value = expressionParser(vm, attr.value, this)

    if (value) {
      if (!cases.if.vNode) insertCase(this, 'if')

      if (cases.else && cases.else.vNode) cases.else.vNode = null
    } else {
      if (cases.if.vNode) cases.if.vNode = null

      insertCase(this, 'else')
    }
  },
})
