import { mix, fetchTemplate as ft } from '@digitalbranch/u'
import Dispatcher from './Dispatcher.js'
import Emitter from './Emitter.js'

const fetchTemplate = async url => await ft(url)

const _private = new WeakMap()

export default class Base extends HTMLElement {
  constructor() {
    super()

    mix(this, Emitter)

    _private.set(this, {
      dispatcher: new Dispatcher(),
    })

    if (this.template && typeof this.template === 'function') {
      _private.get(this).template = this.template()
    } else if (this.templateUrl && typeof this.templateUrl === 'function') {
      _private.get(this).template = fetchTemplate(this.templateUrl())
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
