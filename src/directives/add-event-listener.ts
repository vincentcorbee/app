import { addListener } from '../utils'
import expressionParser from '../parser/expression-parser'
import getListener from './get-listener'
import setValidStateInput from './set-valid-state-input'
import { hyphenToCamel } from '../helpers'
import { App, Directive, VNode } from '../modules'
import { FormControls } from '../modules/form/types'

const addEventListener = (
  vNode: VNode,
  event: string,
  fnName: string,
  params: any[] = [],
  vm: App<any, any, any, any>,
  directive: Directive,
  modifiers: string[] = []
) => {
  // Bind listner to current vm instance?
  const orgListener = getListener(
    fnName == 'emit' ? hyphenToCamel(params[0].value) : fnName,
    vm
  )

  if (
    typeof orgListener.listener != 'function' ||
    vNode.toBeRemoved ||
    vNode.isDetached ||
    !vNode.eventListeners ||
    (vNode.eventListeners[event] &&
      vNode.eventListeners[event].find((fn: Function) => fn === listener))
  )
    return

  const { node } = vNode
  const parentVm = orgListener.vm as App<any, any, any, any>
  const preventDefault = modifiers.includes('prevent')
  const isCustomEvent = modifiers.includes('custom')

  function listener(e: Event) {
    if (preventDefault) e.preventDefault()

    const target = e.target as HTMLElement
    const args = params.map(param =>
      // @ts-expect-error
      param.isString ? param.value : expressionParser(vm, param.value, directive)
    )

    if (fnName === 'emit') {
      // @ts-expect-error
      if (target === node) parentVm.emit(...args, e)
    } else {
      if (event === 'submit' && (target as any).$form) {
        const formElement = target as HTMLFormElement
        const form = formElement.$form
        const valid = form.validate()

        Object.entries(form.formControls as FormControls).forEach(([name, control]) => {
          const element =
            formElement.elements[name as any] || formElement.querySelector(`#${name}`)
          setValidStateInput(control.valid, element)
        })

        if (!valid) return
      }

      orgListener.listener.apply(vm.$parent, args.length ? args : [e])
    }
  }

  vNode.eventListeners[event] = vNode.eventListeners[event] || []

  vNode.eventListeners[event].push(listener)

  if (HTMLElement.prototype.hasOwnProperty(`on${event}`) || isCustomEvent) {
    /*
      This listener has to be removed when the node is no longer in the DOM.
    */
    addListener(node, event, listener, true)
  } else {
    /*
      Parent child communication
      This has to be removed when the node is no longer in the DOM.
    */
    parentVm.on(event, {
      listener,
      eq: 'body',
    })

    vNode.eventListeners[event].push(parentVm)
  }
}
export default addEventListener
