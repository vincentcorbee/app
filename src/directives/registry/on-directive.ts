import { DirectiveConfig } from '../../types'
import addEventListener from '../add-event-listener'

export default (): DirectiveConfig => ({
  name: 'on',
  reg: /^((a-|\*)?on:)|@([^ ]+)(\.[a-z]+)*/,
  bind(vNode, vm) {
    const {
      attr: { name, value, modifiers, rawName },
    } = this
    const event = name.replace(/^((a-|\*)?on:)|@/, '')
    let [params] = value.match(/\([^)]*\)$/) || ['']
    const fnName = value.replace(params, '')

    this.vNode = vNode

    vNode.node.removeAttribute(rawName)

    params = params
      .replace(/^\(|\)$/g, '')
      .split(',')
      .flatMap(param => {
        if (!param) return []

        let isString = false

        if (/^"|'/.test(param)) isString = true

        param = param.replace(/'|"/g, '')

        return {
          isString,
          value: param.trim(),
        }
      })

    addEventListener(vNode, event, fnName, params, vm, this, modifiers)
  },
})
