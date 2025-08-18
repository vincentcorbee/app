import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'
import addEventListener from '../add-event-listener'

export default (_expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'on',
  reg: /^((a-|\*)on:)|@([^ ]+)(\.[a-z]+)*/,
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
      .flatMap((param: string) => {
        if (!param) return []

        let isString = false

        if (/^"|'/.test(param)) isString = true

        param = param.replace(/'|"/g, '')

        return {
          isString,
          value: param.trim(),
        }
      })

    //@ts-expect-error
    addEventListener(vNode, event, fnName, params, vm, this, modifiers)
  },
})
