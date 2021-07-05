import privateData from '../helpers/privateData'

export default class Observable {
  constructor(...args) {
    const self = this

    privateData.attach(self, {
      observers: [],
    })

    Reflect.defineProperty(self, '__observers__', {
      value: privateData.get(self).observers,
    })

    while (args.length) {
      self.subscribe(args.splice(0, 2))
    }
  }
  subscribe(observer, prop) {
    // This does not work, to many observers are being added
    const self = this
    const { observers } = privateData.get(self)

    if (
      observers.every(o => {
        if (o[0] === observer && o[1] === prop) {
          return false
        }

        return true
      })
    ) {
      observer.on('unbind', this.unsubscribe, observer)

      observers.push([observer, prop])

      return true
    }
    return false
  }
  unsubscribe(observer) {
    const self = this
    const { observers } = privateData.get(self)
    const length = observers.length

    privateData.get(self).observers = observers.filter(([ob]) => ob !== observer)

    // console.trace(observer)

    observer.off('unbind', this.unsubscribe)

    // console.trace(getPrivate(self).observers, length)

    return privateData.get(self).observers.length < length
  }

  notify(data) {
    const { observers } = privateData.get(this)
    console.log(observers, data.prop)
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
