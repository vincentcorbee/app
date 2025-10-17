import Emitter from './emitter'
import privateData from './private-data'
import Observable from './observable'

export type Update = { observable: Observable; data: any }

type PrivateData = {
  buffer: Array<Update>
}

// let _idCounter = 0
// const _objectIds = new WeakMap<object, number>()
// const _primitiveIds = new Map<string, number>()

// export function getId(value: any): number {
//   if (value !== null && typeof value === 'object') {
//     if (!_objectIds.has(value)) _objectIds.set(value, ++_idCounter)
//     return _objectIds.get(value)!
//   }

//   // Handle primitives by stringifying
//   const key = typeof value + ':' + String(value)
//   if (!_primitiveIds.has(key)) _primitiveIds.set(key, ++_idCounter)
//   return _primitiveIds.get(key)!
// }

export default class Queue extends Emitter {
  #buffer: Map<string, any>
  #scheduled: boolean

  constructor() {
    super()

    this.#buffer = new Map()
    this.#scheduled = false

    privateData.attach<PrivateData>(this, {
      buffer: [],
    })
  }

  // #makeKey(obs: any, data: any) {
  //   // use WeakMap to generate stable id for observable, here simplified:
  //   const id = getId(obs) // implement getId via WeakMap
  //   return data && data.prop ? `${id}:${data.prop}` : `${id}:_any`
  // }

  // push(update: any) {
  //   const updates = Array.isArray(update) ? update : [update]
  //   const length = updates.length

  //   for (let i = 0; i < length; i++) {
  //     const u = updates[i]
  //     const key = this.#makeKey(u.observable, u.data)

  //     console.log(key, u)

  //     this.#buffer.set(key, u)
  //   }

  //   if (!this.#scheduled) {
  //     this.#scheduled = true
  //     queueMicrotask(() => this.flush())
  //   }
  // }

  // flush() {
  //   this.#scheduled = false
  //   const updates = Array.from(this.#buffer.values())
  //   this.#buffer.clear()
  //   for (const u of updates) u.observable.notify(u.data)
  //   this.emit('flushed')
  // }

  push(update: Update | Array<Update>) {
    const { buffer } = privateData.get<PrivateData>(this)
    const updates = Array.isArray(update) ? update : [update]

    buffer.push(...updates)

    requestIdleCallback(() => this.flush())
  }

  flush() {
    const { buffer } = privateData.get(this)
    const length = buffer.length

    for (let i = 0; i < length; i++) {
      const { observable, data } = buffer[i]

      observable.notify(data)
    }

    privateData.get(this).buffer = []

    this.emit('flushed')
  }

  // push(update: Update | Array<Update>) {
  //   const { buffer } = privateData.get<PrivateData>(this)
  //   const updates = Array.isArray(update) ? update : [update]

  //   for (let i = 0; i < updates.length; i++) {
  //     queueMicrotask(() => buffer.push(updates[i]))

  //     this.flush()
  //   }
  // }

  // flush() {
  //   queueMicrotask(() => {
  //     const { buffer } = privateData.get(this)
  //     const { observable, data } = buffer.shift()

  //     observable.notify(data)

  //     if (buffer.length === 0) this.emit('flushed')
  //   })
  // }
}
