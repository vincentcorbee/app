import Directive from '../modules/directive'
import { ComponentInstance, DirectiveConfig } from '../types'

const createDirective = (
  {
    name,
    reg,
    attr,
    bind = () => {},
    update = () => {},
  }: DirectiveConfig & { attr: any },
  vm: ComponentInstance
) => {
  const directive = new Directive(name, reg, attr, bind, update, vm)

  Object.freeze(directive)

  return directive
}

export default createDirective
