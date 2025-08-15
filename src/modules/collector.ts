import Emitter from './emitter'
import { setZeroTimeout } from '../utils'

class Collector extends Emitter {
  #prevCount: number
  #currentCount: number
  #isCollecting: boolean

  constructor() {
    super()

    this.#prevCount = 0
    this.#currentCount = 0
    this.#isCollecting = false
  }

  start() {
    if (this.#isCollecting) return

    this.#isCollecting = true

    setZeroTimeout(() => {
      if (this.#prevCount !== this.#currentCount) {
        this.#prevCount = this.#currentCount

        this.emit('collect')

        this.#isCollecting = false

        return this.start()
      }

      this.#isCollecting = false
    })
  }

  updateCount(int: number) {
    this.#currentCount += int
  }
}

export default Collector
