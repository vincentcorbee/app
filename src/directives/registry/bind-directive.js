import camelToHyphen from '../../helpers/camelToHyphen'

export default expressionParser => ({
  name: 'bind',
  reg: /^((a-|\*)?bind)?:([^ ]+)/,
  bind(element) {
    const name = this.attr.name.replace(/^((a-|\*)?bind)?:/, '')

    this.attributeName = name
    this.element = element
    this.element.node.removeAttribute(this.attr.name)

    this.update()
  },
  update() {
    const {
      attributeName: name,
      vm,
      expression,
      element: { node },
    } = this
    const self = this

    if (name === 'checked') {
      node.checked = expressionParser(vm, expression, this)
    } else if (name === 'style') {
      let style = ''

      if (/^{[^}]+}$/.test(expression)) {
        const obj = expressionParser(vm, expression, this)

        for (const prop in obj) {
          style += `${camelToHyphen(prop)}:${obj[prop]};`
        }
      }

      node.setAttribute(name, style)
    } else {
      // Attach the data to the node
      if (!node.hasOwnProperty(name)) {
        Reflect.defineProperty(node, name, {
          get() {
            return self.attachedData.get(node)
          },
          set(data) {
            self.attachedData.set(node, data)
          },
        })
      }

      node[name] = expressionParser(vm, expression, this)

      node.setAttribute(name, node[name])
    }
  },
})
