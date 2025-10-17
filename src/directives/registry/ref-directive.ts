import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (_expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'ref',
  reg: /^(a-|\*)ref/,
  bind(vNode, vm) {
    const handleDetached = () => (vm.$refs[this.attr.value] = null)

    vm.$refs[this.attr.value] = vNode.node

    vNode.node.removeAttribute(this.attr.name)

    vNode.once('detached', handleDetached)
  },
})
