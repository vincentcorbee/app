export default expressionParser => ({
  name: 'computed',
  reg: /^computed/,
  bind(_, vm) {
    const expression = this.attr.value

    const value = expressionParser(vm, expression, this)

    this.update()
  },
  update(data) {},
})
