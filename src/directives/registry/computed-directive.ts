import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'computed',
  reg: /^computed/,
  bind(_, vm) {
    const expression = this.attr.value

    const value = expressionParser(vm, expression, this)

    this.update()
  },
  update(data) {},
})
