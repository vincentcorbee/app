import { Observable } from '../modules'

export const attachObservable = (
  target: any,
  observable = new Observable()
): Observable => {
  if (target && !target.hasOwnProperty('__observable__')) {
    Reflect.defineProperty(target, '__observable__', {
      get() {
        return observable
      },
    })

    return observable
  }

  return target.__observable__
}

export default attachObservable
