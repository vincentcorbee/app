import Observable from '../modules/Observable'

const attachObservable = (target, ob = new Observable()) => {
  if (target && !target.hasOwnProperty('__observable__')) {
    Reflect.defineProperty(target, '__observable__', {
      get() {
        return ob
      },
    })

    return ob
  }

  return target.__observable__
}

export default attachObservable
