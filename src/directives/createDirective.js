import Directive from '../models/Directive'

const createDirective = (
  { name, reg, attr, bind = () => {}, update = () => {} } = {},
  vm
) => {
  const directive = new Directive(name, reg, attr, bind, update, vm)

  Object.freeze(directive)

  return directive
}

export default createDirective
