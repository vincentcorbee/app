import privateData from '../helpers/privateData'

let __observer_count__ = 0

export default class Observable {
  constructor(...args) {
    privateData.attach(this, {
      observers: [],
    })

    Reflect.defineProperty(this, '__observers__', {
      get() {
        return privateData.get(this).observers
      },
    })

    while (args.length) {
      this.subscribe(args.splice(0, 2))
    }
  }
  subscribe(observer, prop) {
    const self = this
    const { observers } = privateData.get(self)

    if (
      !observer.isDestroyed &&
      observers.every(o => {
        if (o[0] === observer && o[1] === prop) {
          return false
        }

        return true
      })
    ) {
      observer.on('unbind', this.unsubscribe, observer)

      observers.push([observer, prop])

      __observer_count__++

      return true
    }

    return false
  }
  unsubscribe = observer => {
    const self = this
    const { observers } = privateData.get(self)
    const length = observers.length

    privateData.get(self).observers = observers.filter(
      ([ob]) => ob !== observer && !ob.isDestroyed
    )

    const isUnsubscribed = privateData.get(self).observers.length < length

    if (isUnsubscribed) {
      observer.off('unbind', this.unsubscribe)

      __observer_count__--
    }

    return isUnsubscribed
  }

  notify(data) {
    const { observers } = privateData.get(this)

    for (const [directive, prop] of observers) {
      if (!data.prop) {
        directive.update(data)
      } else if (prop && prop === data.prop) {
        directive.update(data)
      }
    }

    return this
  }
}
