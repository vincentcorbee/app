import { mix, fetchTemplate as ft } from '../helpers/U'
import Dispatcher from './Dispatcher.js'
import Emitter from './Emitter.js'

const fetchTemplate = async url => await ft(url)

const _private = new WeakMap()

export default class Base extends HTMLElement {
  constructor() {
    super()

    const self = this

    mix(self, Emitter)
    _private.set(self, {
      dispatcher: new Dispatcher(),
    })

    if (self.template && typeof self.template === 'function') {
      _private.get(self).template = self.template()
    } else if (self.templateUrl && typeof self.templateUrl === 'function') {
      _private.get(self).template = fetchTemplate(self.templateUrl())
    }
  }

  get dispatcher() {
    return _private.get(this).dispatcher
  }

  get $template() {
    return _private.get(this).template
  }

  render() {
    return this.render || function () {}
  }
}
