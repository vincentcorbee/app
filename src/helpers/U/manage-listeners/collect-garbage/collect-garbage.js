import isInPage from '../../is-in-page/is-in-page'

const collectGarbage = (that, int) => {
  const s = new Date()
  const interval = () =>
    setTimeout(() => {
      const t = new Date()

      if (t - s >= int) {
        that.listeners.forEach(o => {
          const { obj } = o

          if (!isInPage(obj)) {
            that.remove(obj, o.eventType, o.fn)
          }
        })

        collectGarbage(that, int)
      } else {
        interval()
      }
    }, 1000)
  interval()
}

export default collectGarbage
