export default () => {
  const timeouts = []
  const messageName = 'zero-timeout-message'
  /*
    Like setTimeout, but only takes a function argument. There's
    no time argument (always zero) and no arguments (you have to
    use a closure).
  */
  const setZeroTimeout = fn => {
    timeouts.push(fn)

    window.postMessage(messageName, '*')
  }
  const handleMessage = event => {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation()

      if (timeouts.length > 0) {
        timeouts.shift()()
      }
    }
  }

  window.addEventListener('message', handleMessage, true)

  return setZeroTimeout
}
