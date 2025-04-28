import { privateData } from '.'

export default class Observable {
  constructor(...args: [string, any][]) {
    privateData.attach(this, {
      observers: [],
    })

    Reflect.defineProperty(this, '__observers__', {
      get() {
        return privateData.get(this).observers
      },
    })

    while (args.length) {
      const [event, listener] = args.splice(0, 1)

      this.subscribe(event, listener)
    }
  }

  subscribe(observer: any, prop: any) {
    const { observers } = privateData.get(this)

    if (observer.isDestroyed) return false

    if (
      observers.some(
        (currentObserver: any) =>
          currentObserver[0] === observer && currentObserver[1] === prop
      )
    ) {
      return false
    }

    observers.push([observer, prop])

    return true
  }

  unsubscribe = (observer: any) => {
    const { observers } = privateData.get(this)
    const length = observers.length

    privateData.get(this).observers = observers.filter(
      ([ob]: any[]) => ob !== observer && !ob.isDestroyed
    )

    const isUnsubscribed = privateData.get(this).observers.length < length

    return isUnsubscribed
  }

  notify(data: any) {
    const { observers } = privateData.get(this)

    for (const [directive, prop] of observers) {
      if (!data.prop) directive.update(data)
      else if (prop && prop === data.prop) directive.update(data)
    }

    return this
  }
}
