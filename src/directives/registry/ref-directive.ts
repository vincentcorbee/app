import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (_expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'ref',
  reg: /^(a-|\*)ref/,
  bind(vNode, vm) {
    vm.$refs = {
      ...vm.$refs,
      [this.attr.value]: vNode.node,
    }

    vNode.node.removeAttribute(this.attr.name)
  },
})
