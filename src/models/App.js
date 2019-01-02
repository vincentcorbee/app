import Emitter from './Emitter'
import Mask from './Mask.js'
import ArrayMask from './ArrayMask'
import Element from './Element'
import { isType, http } from '../lib/U'
import createComponent from '../helpers/createComponent'
import Queue from './Queue'
import createTemplate from '../helpers/createTemplate'
// import privateData from './helpers/privateData'

const privateData = new WeakMap()

export default class App extends Emitter {
  static component(name, component) {
    components.name = component.name || name
    createComponent(component)
  }
  constructor(config) {
    super()
    let vm = this
    let _data = config.data
      ? typeof config.data === 'function'
        ? config.data()
        : config.data
      : {}
    let _methods = config.methods || {}
    let _parent = config.parent || null
    let _template = config.template || null
    let el = config.el || null
    let _listeners = config.listeners || null
    let _components = config.components || {}
    let _router = config.router || null
    // This is the update queue for al the data changes and updates
    // I do find this to cause a lag
    let queue = new Queue()
    let handler = {
      get(target, prop) {
        const data = target[prop]
        if (
          typeof data === 'object' &&
          data !== null &&
          data !== undefined &&
          prop !== '__observable__'
        ) {
          if (Array.isArray(data)) {
            return new ArrayMask(data, handler, vm, queue)
          } else {
            return new Mask(data, handler, vm, queue)
          }
        } else {
          return data
        }
      },
      set(target, prop, value) {
        if (Reflect.get(target, prop) !== value) {
          const ob = target[prop] ? target[prop].__observable__ : null
          if (
            ob &&
            value !== undefined &&
            value !== null &&
            !value.hasOwnProperty('__observable__')
          ) {
            Reflect.defineProperty(value, '__observable__', {
              value: ob
            })
          }
          target[prop] = value
          return true
        }
      }
    }

    const _proxy = new Mask(_data, handler, vm, queue)

    privateData.set(vm, {
      el,
      _isDestroyed: false,
      _toBeDestroyed: false,
      _isMounted: false,
      _parent,
      _router,
      _children: [],
      _template,
      data: null,
      node: null,
      nextTick() {
        return new Promise((resolve, reject) => queue.on('flushed', () => resolve()))
      },
      compile(vm, el = null) {
        if (el) {
          let element = new Element(el, vm)
          privateData.get(vm).el = element
          privateData.get(vm).node = element.node
          // Why is this node property gone
          // Set mutation observer
          let { node } = privateData.get(vm)
          if (node && node.parentNode) {
            let mutationObserver = new MutationObserver(mutations =>
              mutations.forEach(mutation => {
                for (const removed of mutation.removedNodes) {
                  if (removed === node) {
                    // destroy(vm)
                    mutationObserver.disconnect()
                    mutationObserver = null
                    node = null
                    break
                  }
                }
              })
            )
            mutationObserver.observe(node.parentNode, {
              childList: true
            })
            // Remove cloak attribute
            if (node.getAttribute('a-cloak') !== undefined) {
              node.removeAttribute('a-cloak')
            }
          }
          element = null
        }
      },
      destroy(vm) {
        privateData.get(vm)._toBeDestroyed = true
        if (_parent) {
          _parent.children.splice(_parent.children.indexOf(vm), 1)
          privateData.get(vm)._parent = null
        }
        privateData.get(vm).node = null
        privateData.get(vm).el = null
        privateData.get(vm).data = null
        // Should be disconnected
        privateData.get(vm)._methods = null
        // Should be disconnected
        privateData.get(vm)._listeners = null
        _proxy.revoke()
        privateData.get(vm)._proxy = {}

        handler = {}

        // Destroy child vm's if not already destroyed
        privateData.get(vm)._children.forEach(child => {
          if (!child.isDestroyed) {
            child.destroy()
          }
        })

        Reflect.ownKeys(vm).forEach(key => (vm[key] = null))

        privateData.get(vm)._isDestroyed = true
      },
      init(vm) {
        // Fire load event
        vm.emit('load')

        if (_parent && _parent.children.indexOf(vm) === -1) {
          _parent.children.push(vm)
        }

        // Create components
        for (const name in _components) {
          _components[name].name = _components[name].name || name
          createComponent(_components[name], vm)
        }

        // Set listeners
        for (let listener in _listeners) {
          vm.on(listener, _listeners[listener].bind(vm))
        }

        // Mask data and copy properties on instance
        privateData.get(vm).data = _proxy

        for (let prop in _data) {
          Reflect.defineProperty(vm, prop, {
            enumerable: true,
            get() {
              if (!_proxy.isRevoked) {
                return _proxy[prop]
              } else {
                return null
              }
            },
            set(value) {
              if (!_proxy.isRevoked && Reflect.get(_proxy, prop) !== value) {
                _proxy[prop] = value
              }
            }
          })
        }

        // Copy methods on instance
        for (let prop in _methods) {
          Reflect.defineProperty(vm, prop, {
            get() {
              return _methods[prop].bind(vm)
            }
          })
        }

        // compile the template and set mutation observer
        privateData.get(vm).compile(vm, el)

        // Fire ready event
        vm.emit('ready')
      }
    })

    // If there is a router, dispatch it if it hasn't already
    if (_router && !_router.$vm) {
      Reflect.defineProperty(_router, '$vm', {
        get() {
          return vm
        }
      })
      _router.dispatch()
    }

    privateData.get(vm).init(vm)
  }
  $nextTick() {
    return privateData.get(this).nextTick()
  }
  $mount(el = null) {
    const vm = this
    let { compile, _template } = privateData.get(vm)
    let node = el
      ? isType('String', el)
        ? document.querySelector(el)
        : isType('Node', el)
        ? el
        : null
      : null
    let template = createTemplate(_template)

    compile(vm, template.content.firstElementChild)

    if (node) {
      if (node.parentNode) {
        node.parentNode.replaceChild(vm.node, node)
      }
    }

    node = null

    privateData.get(vm)._isMounted = true

    return vm
  }
  get isDestroyed() {
    return privateData.get(this)._isDestroyed
  }
  get isMounted() {
    return privateData.get(this)._isMounted
  }
  get children() {
    return privateData.get(this)._children
  }
  get parent() {
    return privateData.get(this)._parent
  }
  get $destroy() {
    return () => privateData.get(this).destroy(this)
  }
  get $http() {
    return http
  }
  get $route() {
    let router = privateData.get(this)._router
    let parent = this.parent
    if (!router && parent) {
      router = parent.$router
    }
    return router.req
  }
  get $router() {
    let router = privateData.get(this)._router
    let parent = this.parent
    if (!router && parent) {
      router = parent.$router
    }
    return router
  }
  get node() {
    return privateData.get(this).node
  }
  get el() {
    return privateData.get(this).el
  }
  get data() {
    return privateData.get(this).data
  }
}
