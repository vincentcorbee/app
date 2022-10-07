export default () => ({
  name: 'ref',
  reg: /^(a-|\*)?ref/,
  bind(element, vm) {
    vm.$refs = {
      [this.attr.value]: element.node,
    }
  },
})
