export default expressionParser => ({
  name: 'text',
  reg: /(\{{+.*\}})|^(a-|\*)?text/,
  bind(element) {
    const placeholder = this.attr.placeholder

    this.element = element
    this.orgNode = element.node.cloneNode(true)
    this.placeholder = placeholder

    // log(`${element.node.data} NODE DATA BIND`, 'blue')
    // log(`${placeholder.value} PLACEHOLDER BIND`, 'indigo')

    // console.log('----------')

    this.update()
  },
  update() {
    const element = this.element
    // log(`${this.expression} VALUE UPDATE`, 'darkyellow')

    if (element) {
      const node = element.node
      const parent = node.parentNode

      if (node && parent) {
        const { placeholder, expression, vm, orgNode } = this
        const clone = orgNode.cloneNode(true)
        const value = expressionParser(vm, expression, this)
        const nodeValue = clone.data.split(placeholder.value).join(value)

        if (node.data == nodeValue) return

        // log(`${placeholder.value} PLACEHOLDER UPDATE`, 'brown')
        // log(`${node.data} NODE DATA UPDATE`, 'darkgreen')
        // log(`${orgNode.data} ORG NODE UPDATE`, 'darkred')
        // log(`${nodeValue} VALUE UPDATE`, 'darkyellow')

        // if (placeholder) {
        clone.data = nodeValue
        element.node = clone

        parent.replaceChild(clone, node)
        // }
      }
    }
  },
})
