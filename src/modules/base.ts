import { mix } from '../utils'
import Dispatcher from './dispatcher'
import Emitter from './emitter'

const _private = new WeakMap()

export default class Base extends HTMLElement {
  constructor() {
    super()

    mix(this, Emitter)

    _private.set(this, {
      dispatcher: new Dispatcher(),
    })
  }

  protected on(event: string, callback: Function) {}

  protected emit(event: string, data?: any) {}

  get dispatcher() {
    return _private.get(this).dispatcher
  }

  render() {
    return this.render || function () {}
  }
}
