import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (_expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'ref',
  reg: /^(a-|\*)ref/,
  bind(vNode, vm) {
    const { value: refName, name } = this.attr
    const handleDetached = () => (vm.$refs[refName] = null)

    vm.$refs[refName] = vNode.node

    vNode.node.removeAttribute(name)

    vNode.once('detached', handleDetached)
  },
})
