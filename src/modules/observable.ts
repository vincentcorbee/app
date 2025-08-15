import privateData from './private-data'

type Observer = {
  update: (data: any, prop?: any) => void
  isDestroyed: boolean
}

type ObservableData = {
  observers: [Observer, any][]
}

export default class Observable {
  constructor() {
    privateData.attach(this, {
      observers: [],
    })
  }

  get __observers__() {
    return privateData.get<ObservableData>(this).observers
  }

  subscribe(observer: Observer, prop: any) {
    if (observer.isDestroyed) return false

    const { observers } = privateData.get<ObservableData>(this)

    if (
      observers.some(
        ([currentObserver, currentProp]) =>
          currentObserver === observer && currentProp === prop
      )
    ) {
      return false
    }

    observers.push([observer, prop])

    return true
  }

  unsubscribe = (observer: Observer) => {
    const { observers } = privateData.get<ObservableData>(this)
    const length = observers.length

    privateData.get(this).observers = observers.filter(
      ([currentObserver]) => currentObserver !== observer && !currentObserver.isDestroyed
    )

    const isUnsubscribed = privateData.get<ObservableData>(this).observers.length < length

    return isUnsubscribed
  }

  notify(data: any) {
    const { observers } = privateData.get<ObservableData>(this)

    for (let i = 0; i < observers.length; i++) {
      const [observer, prop] = observers[i]

      if (!data.prop) observer.update(data)
      else if (prop && prop === data.prop) observer.update(data)
    }

    return this
  }
}
