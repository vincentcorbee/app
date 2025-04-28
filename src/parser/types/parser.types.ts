import Directive from '../../modules/directive'
import { ComponentInstance } from '../../types'

export type ExpressionParser = (
  vm: ComponentInstance,
  expression: string,
  directive?: Directive
) => any
