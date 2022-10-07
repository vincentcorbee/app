import insertCase from '../insertCase'
import getCases from '../getCases'

export default expressionParser => ({
  name: 'if',
  reg: /^(a-|\*)?if/,
  bind(element, vm) {
    const node = element.node
    const value = expressionParser(vm, this.attr.value, this)
    // get the index of the node
    const index = node.parentNode
      ? [].indexOf.call(node.parentNode.childNodes, element.node)
      : 0

    value && value.value !== undefined ? value.value : value

    // Remove the attribute
    node.removeAttribute(this.attr.name)

    this.cases = getCases(
      {
        index,
        element: null,
        orgNode: node.cloneNode(true),
        identifier: this.attr.value,
      },
      node
    )
    this.element = element

    this.update({
      type: 'set',
      value,
    })
  },
  update(data) {
    const { cases } = this

    /*
      Checking for the contstructor name is a hack that is
      needed for passing the observer to the child properties
    */

    if ((!data.target || data.target.constructor.name !== 'Mask') && cases) {
      if (data.value) {
        if (!cases.if.element) insertCase(this, 'if')

        if (cases.else && cases.else.element) cases.else.element = null
      } else {
        if (cases.if.element) cases.if.element = null

        insertCase(this, 'else')
      }
    }
  },
})
