import { Signal } from './signal'

export type SignalInstance<T> = {
  (): T
  set(value: T): void
  update(updater: (value: T) => T): void
  onChange(callback: (value: T) => void): void
}

const signalFactory = <T>(value: T): SignalInstance<T> => {
  const signal = new Signal<T>(value)

  function instance() {
    return signal.value
  }

  Object.defineProperties(instance, {
    set: {
      value(value: T) {
        signal.set(value)
      },
    },
    update: {
      value: (updater: (value: T) => T) => {
        signal.update(updater)
      },
    },
    onChange: {
      value: (callback: (value: T) => void) => {
        signal.on('change', callback)
      },
    },
  })

  return instance as SignalInstance<T>
}

export { signalFactory as signal }
