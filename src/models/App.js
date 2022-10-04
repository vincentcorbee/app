import Emitter from './Emitter'
import Mask from './Mask.js'
import ArrayMask from './ArrayMask'
import Element from './Element'
import { isType, http } from '../helpers/U'
import createComponent from '../helpers/createComponent'
import Queue from './Queue'
import createTemplate from '../helpers/createTemplate'
import getSourceValue from '../helpers/getSourceValue'
import isArrayMask from '../helpers/isArrayMask'
import isMask from '../helpers/isMask'

let __id__ = 0

export default class App extends Emitter {
  static async component(name, component) {
    component.name = component.name || name

    return await createComponent(component)
  }

  #data = null
  #methods = {}
  #parent = null
  #template = null
  #el = null
  #listeners = {}
  #components = {}
  #router = null
  #computed = {}
  #proxy = null
  #refs = {}
  #isDestroyed = false
  #toBeDestroyed = false
  #isMounted = false
  #children = []
  #queue = new Queue()
  #handler = {}
  #node = null

  constructor(config = {}) {
    super()

    const {
      data = {},
      methods = {},
      parent = null,
      template = null,
      el = null,
      listeners = {},
      components = {},
      router = null,
      computed = {},
    } = config
    const vm = this

    this.id = __id__++

    this.#data = data ? (typeof data === 'function' ? data() : data) : {}
    this.#methods = methods
    this.#parent = parent
    this.#template = template
    this.#node = el
    this.#listeners = listeners
    this.#components = components
    this.#router = router
    this.#computed = computed

    this.#handler = {
      get(target, prop) {
        const data = target[prop]

        if (
          data !== null &&
          data !== undefined &&
          prop !== '__observable__' &&
          typeof data === 'object'
        ) {
          const { constructor } = data

          if (!isMask(constructor) && !isArrayMask(constructor)) {
            if (Array.isArray(data)) {
              return new ArrayMask(data, vm.#handler, vm.#queue)
            } else {
              return new Mask(data, vm.#handler, vm.#queue)
            }
          }

          return data
        }

        return data
      },
      set(target, prop, value) {
        if (Reflect.get(target, prop) !== value) {
          const ob = target[prop] ? target[prop].__observable__ : null

          value = getSourceValue(value, ob)

          // console.log(
          //   `%c${prop} APP`,
          //   'background-color: orange; color: black; padding: 5px'
          // )

          // console.log(prop, value)

          // if (
          //   ob &&
          //   value !== undefined &&
          //   value !== null &&
          //   !value.hasOwnProperty('__observable__')
          // ) {
          //   // Set value to observable
          //   // ob.value = value

          //   Reflect.defineProperty(value, '__observable__', {
          //     value: ob,
          //   })
          // }

          target[prop] = value

          return true
        }
      },
    }

    this.#proxy = new Mask(this.#data, this.#handler, this.#queue)

    this.#init()
  }

  $nextTick() {
    return this.#nextTick()
  }

  async $mount(el = null) {
    const _template = this.#template
    const node = el
      ? isType('string', el)
        ? document.querySelector(el)
        : isType('node', el)
        ? el
        : null
      : null

    if (_template === null || _template === undefined) {
      throw Error('A template is not supplied.')
    }

    const template = createTemplate(
      typeof _template === 'object' ? await _template : _template
    )

    this.#compile(template.content.firstElementChild)

    if (node && node.parentNode) {
      node.parentNode.replaceChild(this.#node, node)
    }

    this.#isMounted = true

    return this
  }

  get toBeDestroyed() {
    return this.#toBeDestroyed
  }

  get isDestroyed() {
    return this.#isDestroyed
  }

  get isMounted() {
    return this.#isMounted
  }

  get children() {
    return this.#children
  }

  get $parent() {
    return this.#parent
  }

  get $destroy() {
    return () => this.#destroy()
  }

  get $http() {
    return http
  }

  get $route() {
    let router = this.#router
    const parent = this.parent

    if (!router && parent) {
      router = parent.$router
    }

    return router.req
  }

  get $router() {
    let router = this.#router
    const parent = this.parent

    if (!router && parent) {
      router = parent.$router
    }

    return router
  }

  get node() {
    return (this.#el && this.#el.node) || null
  }

  get el() {
    return this.#el
  }

  get data() {
    return this.#proxy
  }

  get _data() {
    return this.#data
  }

  #copyDataToInstance() {
    const _proxy = this.#proxy
    const _data = this.#data

    for (const prop of Object.keys(_data)) {
      Reflect.defineProperty(this, prop, {
        enumerable: true,
        get() {
          if (!_proxy.isRevoked) {
            return _proxy[prop]
          } else {
            return undefined
          }
        },
        set(value) {
          if (!_proxy.isRevoked && Reflect.get(_proxy, prop) !== value) {
            _proxy[prop] = value
          }
        },
      })
    }
  }

  #setComputedProperties() {
    const vm = this

    for (const [prop, desc] of Object.entries(vm.#computed)) {
      let descripter

      if (typeof desc === 'function') {
        descripter = {
          get() {
            return desc.call(vm)
          },
        }
      } else if (typeof desc === 'object') {
        if (typeof desc.get !== 'function') {
          throw Error(`A getter is required for a computed property.`)
        }

        descripter = {
          get() {
            return desc.get.call(vm)
          },
        }

        if (typeof desc.set === 'function') {
          descripter.set = () => desc.set.apply(vm, arguments)
        }
      }

      descripter.enumerable = true

      Reflect.defineProperty(vm, prop, descripter)
    }
  }

  #copyMethodsToInstance() {
    const vm = this

    for (const [name, method] of Object.entries(vm.#methods)) {
      Reflect.defineProperty(vm, name, {
        get() {
          return method.bind(vm)
        },
      })
    }
  }

  async #createComponents() {
    for (const [name, component] of Object.entries(this.#components)) {
      component.name = component.name || name

      await createComponent(component, this)
    }
  }

  #dispatchRouter() {
    const vm = this
    const _router = vm.#router

    if (_router && !_router.$vm) {
      _router.$vm = vm
    }
  }

  #setRefs() {
    const vm = this

    Reflect.defineProperty(vm, '$refs', {
      get() {
        return vm.#refs
      },
      set(refs) {
        return (vm.#refs = {
          ...vm.#refs,
          ...refs,
        })
      },
    })
  }

  #setListeners() {
    const vm = this

    for (const [event, listener] of Object.entries(vm.#listeners)) {
      vm.on(event, listener.bind(vm))
    }
  }

  async #init() {
    const vm = this
    const _parent = vm.#parent

    // Set listeners
    vm.#setListeners()

    // Fire load event
    vm.emit('load')

    if (_parent && _parent.children.includes(vm)) {
      _parent.children.push(vm)
    }

    // Set refs
    vm.#setRefs()

    // Copy data on to instance
    vm.#copyDataToInstance()

    // Set the computed properties
    vm.#setComputedProperties()

    // Copy methods on to instance
    vm.#copyMethodsToInstance()

    // compile the template and set mutation observer
    vm.#compile(vm.#node)

    // Create components
    await vm.#createComponents()

    // If there is a router, dispatch it if it hasn't already
    vm.#dispatchRouter()

    if (vm.#el) {
      vm.#isMounted = true
    }

    // Fire ready event
    vm.emit('ready')
  }

  #compile(el = null) {
    if (el) {
      const element = new Element(el, this, null, [], this.#node && this.#node.shadowRoot)
      const { node } = element

      element.on('detached', this.#destroy, this)

      this.#el = element
      this.#node = node

      // Set mutation observer

      if (node) {
        // Remove cloak attribute
        if (node.getAttribute('a-cloak') !== undefined) {
          node.removeAttribute('a-cloak')
        }
      }
    }
  }

  #destroy = () => {
    const _el = this.#el
    const _parent = this.#parent
    const _listeners = this.#listeners

    this.#toBeDestroyed = true

    this.#proxy.revoke()

    if (_parent) {
      _parent.children.splice(_parent.children.indexOf(this), 1)

      this.#parent = null
    }

    this.#node = null

    if (_el) {
      _el.$destroy()

      this.#el = null
    }

    _el.off('detached', this.#destroy)

    this.#methods = null

    for (const [listener, fn] of Object.entries(_listeners)) {
      this.off(listener, fn.bind(this))
    }

    this.#listeners = {}

    this.#proxy = null

    this.#handler = {}

    // Destroy child vm's if not already destroyed
    this.#children.forEach(child => {
      if (!child.isDestroyed) {
        child.$destroy()
      }
    })

    this.#isDestroyed = true
    this.#isMounted = false
  }

  #nextTick() {
    return new Promise(resolve => this.#queue.on('flushed', resolve))
  }
}
