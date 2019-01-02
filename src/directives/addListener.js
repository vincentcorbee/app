import { addListener } from '../lib/U'
const addEventListener = (node, event, fnName, orgListener, element, params, vm) => {
  // Bind listner to current vm instance?
  const listener = e => {
    if (fnName === 'emit') {
      vm.emit(params, e)
    } else {
      orgListener.call(vm, params || e)
    }
  }
  element.listeners[event] = listener
  if (HTMLElement.prototype.hasOwnProperty(`on${event}`)) {
    addListener(node, event, listener, true)
  } else {
    //Work around for parent child communication
    vm.children.forEach(child => child.on(event, listener))
  }
}
export default addEventListener
