//@ts-nocheck
import isInPage from '../is-in-page'

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback, options) {
    options = options || {}

    const relaxation = 1
    const timeout = options.timeout || relaxation
    const start = performance.now()

    return setTimeout(function () {
      callback({
        get didTimeout() {
          return options.timeout
            ? false
            : performance.now() - start - relaxation > timeout
        },
        timeRemaining: function () {
          return Math.max(0, relaxation + (performance.now() - start))
        },
      })
    }, relaxation)
  }
}

if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function (id) {
    clearTimeout(id)
  }
}

export const collectGarbage = (instance, interval = 60000) => {
  const s = performance.now()
  const handler = () =>
    requestIdleCallback(
      () => {
        const t = performance.now()

        if (t - s >= interval) {
          instance.listeners.forEach(o => {
            const { obj } = o

            if (!isInPage(obj)) instance.remove(obj, o.eventType, o.fn)
          })

          return collectGarbage(instance, interval)
        } else {
          return handler()
        }
      },
      { timeout: 1000 }
    )
  return handler()
}

export default collectGarbage
