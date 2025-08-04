import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (
  _expressionParser: ExpressionParser
): DirectiveConfig<HTMLFormElement> => ({
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

    // @ts-expect-error
    node.$form = vm[this.attr.value]

    node.removeAttribute(this.attr.name)
  },
})
