import Directive from './Directive'

const createDirective = ({
  name,
  reg,
  attr,
  bind = () => {},
  update = () => {},
} = {}) => {
  const directive = new Directive(name, reg, attr, bind, update)

  Object.freeze(directive)

  return directive
}

export default createDirective
