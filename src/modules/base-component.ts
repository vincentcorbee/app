import { mix } from '../utils'
import Emitter from './emitter'

export default class BaseComponent extends HTMLElement {
  constructor() {
    super()

    mix(this, Emitter)
  }

  on(event: string, callback: Function) {}

  protected emit(event: string, data?: any) {}
}
