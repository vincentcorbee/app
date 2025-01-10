//@ts-nocheck
import isInPage from '../is-in-page'

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback, options) {
    var options = options || {}
    var relaxation = 1
    var timeout = options.timeout || relaxation
    var start = performance.now()
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

export const collectGarbage = (self, int = 60000) => {
  const s = performance.now()
  const interval = () =>
    requestIdleCallback(
      () => {
        const t = performance.now()

        if (t - s >= int) {
          self.listeners.forEach(o => {
            const { obj } = o

            if (!isInPage(obj)) self.remove(obj, o.eventType, o.fn)
          })

          return collectGarbage(self, int)
        } else return interval()
      },
      { timeout: 1000 }
    )
  return interval()
}

export default collectGarbage
