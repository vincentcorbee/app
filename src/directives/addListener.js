import { addListener } from '../helpers/U'
import expressionParser from '../helpers/expressionParser'
import getListener from './getListener'

const hyphenToCamel = (input = '') =>
  input
    .split('-')
    .reduce(
      (acc, val, i) => (i === 0 ? val : (acc += val[0].toUpperCase() + val.substring(1))),
      ''
    )

const addEventListener = (element, event, fnName, params = [], vm, directive) => {
  // Bind listner to current vm instance?
  const orgListener = getListener(
    fnName === 'emit' ? hyphenToCamel(params[0].value) : fnName,
    vm
  )

  if (
    typeof orgListener.listener !== 'function' ||
    element.toBeRemoved ||
    element.isDetached ||
    (element.eventListeners[event] &&
      element.eventListeners[event].find(fn => fn === listener))
  ) {
    return
  }

  const { node } = element
  const parent = orgListener.vm

  const listener = e => {
    const args = params.map(param =>
      param.isString ? param.value : expressionParser(vm, param.value, directive)
    )

    if (fnName === 'emit') {
      if (e.target === node) {
        parent.emit(...args, e)
      }
    } else {
      orgListener.listener.apply(vm.parent, args.length ? args : [e])
    }
  }

  element.eventListeners[event] = element.eventListeners[event] || []

  element.eventListeners[event].push(listener)

  if (HTMLElement.prototype.hasOwnProperty(`on${event}`)) {
    /*
      This listener has to be removed when the node is no longer in the DOM.
    */
    addListener(node, event, listener, true)
  } else {
    /*
      Parent child communication
      This has to be removed when the node is no longer in the DOM.
    */

    parent.on(event, {
      listener,
      eq: 'body',
    })

    element.eventListeners[event].push(parent)
  }
}
export default addEventListener
