import privateData from '../helpers/privateData'
import Emitter from './Emitter'
import { setZeroTimeout } from '@digitalbranch/u'

class Collector extends Emitter {
  constructor() {
    super()
    this.count = 0
    this.isCollecting = false

    privateData.attach(this, {
      __count__: 0,
    })
  }

  start() {
    if (this.isCollecting) return

    this.isCollecting = true

    setZeroTimeout(() => {
      const __count__ = privateData.get(this)

      if (this.count !== __count__) {
        this.count = __count__

        this.emit('collect')

        this.isCollecting = false

        return this.start()
      }

      this.isCollecting = false
    })
  }

  updateCount(int) {
    privateData.get(this).__count__ += int
  }
}

export default Collector
