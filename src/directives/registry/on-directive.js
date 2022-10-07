import addEventListener from '../addListener'

export default () => ({
  name: 'on',
  reg: /^((a-|\*)?on:)|@([^ ]+)(\.[a-z]+)*/,
  bind(element, vm) {
    const {
      attr: { name, value, modifiers, rawName },
    } = this
    const event = name.replace(/^((a-|\*)?on:)|@/, '')
    let [params] = value.match(/\([^)]*\)$/) || ['']
    const fnName = value.replace(params, '')

    this.element = element

    element.node.removeAttribute(rawName)

    params = params
      .replace(/^\(|\)$/g, '')
      .split(',')
      .flatMap(param => {
        if (param) return []

        let isString = false

        if (/^"|'/.test(param)) {
          isString = true
          param = param.replace(/'|"/g, '')
        }

        return {
          isString,
          value: param.trim(),
        }
      })

    addEventListener(element, event, fnName, params, vm, this, modifiers)
  },
})
