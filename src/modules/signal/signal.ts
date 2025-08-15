import Emitter from '../emitter'

export class Signal<T> extends Emitter {
  #value: T

  constructor(value: T) {
    super()
    this.#value = value
  }

  set(value: T) {
    if (this.#value !== value) {
      this.#value = value
      this.emit('change', value)
    }
  }

  update(updater: (value: T) => T) {
    this.set(updater(this.#value))
  }

  get value() {
    return this.#value
  }
}
