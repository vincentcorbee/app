import isInPage from '../../is-in-page/is-in-page'

const collectGarbage = (that, int) => {
  const s = new Date()
  const interval = () =>
    requestIdleCallback(
      () => {
        const t = new Date()

        if (t - s >= int) {
          that.listeners.forEach(o => {
            const { obj } = o

            if (!isInPage(obj)) {
              that.remove(obj, o.eventType, o.fn)
            }
          })

          return collectGarbage(that, int)
        } else {
          return interval()
        }
      },
      { timeout: 1000 }
    )
  return interval()
}

// class GarbageCollector {
//   constructor() {
//     this.isStarted = false;
//     this.id = null;

//   }
//     collect() {
//       if (this.isStarted) return

//       this.id = collectGarbage()

//       this.isStarted = true
//     }
//     stop() {
//       cancelRequestIdleCallback(this.id)

//       this.id = null
//       this.isStarted = false
//     }
// }

export default collectGarbage
