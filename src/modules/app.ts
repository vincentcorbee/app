import Emitter from './emitter'
import Mask from './mask'
import ArrayMask from './array-mask'
import VNode from './v-node'
import { isType } from '../utils'
import Queue from './queue'
import {
  createWebComponent,
  createTemplate,
  getSourceValue,
  isArrayMask,
  isMask,
  attachObservable,
} from '../helpers'
import {
  ComponentConfig,
  ComponentInstance,
  ComponentInterface,
  ComputedOptions,
  ListnersOptions,
  MethodsOptions,
  RouterInterface,
} from '../types'
import { StoreInstance } from './store/types'

let __id__ = 0

declare global {
  interface Element {
    on(event: string, fn: Function): void
    off(event: string, fn: Function): void
    isCustomElement?: boolean
  }
}

export default class App<
    D,
    M extends MethodsOptions,
    L extends ListnersOptions,
    C extends ComputedOptions
  >
  extends Emitter
  implements ComponentInterface<D, M, L, C>
{
  static async component<
    D,
    M extends MethodsOptions,
    L extends ListnersOptions,
    C extends ComputedOptions
  >(name: string, config: ComponentConfig<D, M, L, C>) {
    config.name = config.name || name

    return await createWebComponent(config)
  }

  static registeredWebComponents = new Set()

  #data
  #methods: M | null = null
  #parent: ComponentInstance | null = null
  #template: ComponentConfig<D, M, L, C>['template'] | null = null
  #el: VNode | null = null
  #listeners: L | null = null
  #components: Record<string, ComponentConfig<any, any, any, any>> = {}
  #router: RouterInterface | null = null
  #store: Mask<StoreInstance<any, any, any>> | null = null
  #computed: C | null = null
  #proxy: Mask<D> | null = null
  #refs = {}
  #isDestroyed: boolean = false
  #toBeDestroyed: boolean = false
  #isMounted: boolean = false
  #children: Array<ComponentInstance> = []
  #queue = new Queue()
  #handler = {}
  #node: Element | null = null
  #providers = null
  #dependencies = {}
  #root: string | null = null

  #currentComputedProperty: string | null = null
  #computedPropertyHandler: Map<string, any> = new Map()

  id: number

  $$store: StoreInstance<any, any, any> | null = null

  constructor(config: ComponentConfig<D, M, L, C> & { parent?: ComponentInstance }) {
    super()

    const {
      data = null,
      methods = null,
      parent = null,
      template = null,
      el = null,
      listeners = null,
      components = {},
      router = null,
      computed = null,
      store = null,
      provide = {},
      inject = {},
    } = config
    const vm = this

    this.id = __id__++

    this.#methods = methods
    this.#template = template
    this.#root = el
    this.#node = el && typeof el !== 'string' ? el : null
    this.#listeners = listeners
    this.#components = components
    this.#router = router
    this.#computed = computed
    this.#providers = provide ? (typeof provide === 'function' ? provide() : provide) : {}
    this.#dependencies = Array.isArray(inject)
      ? inject.reduce((acc, key) => ({ ...acc, [key]: key }), {})
      : inject

    this.#handler = {
      get(target: any, prop: any) {
        const data = target[prop]

        if (
          prop !== '__observable__' &&
          target.__observable__ &&
          vm.#currentComputedProperty
        ) {
          const directive = vm.#computedPropertyHandler.get(vm.#currentComputedProperty)

          if (directive) target.__observable__.subscribe(directive, prop)
        }

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
      set(target: any, prop: any, value: any) {
        if (Reflect.get(target, prop) !== value) {
          const ob = target[prop] ? target[prop].__observable__ : null

          value = getSourceValue(value, ob)

          target[prop] = value

          return true
        }
      },
    }

    if (parent) this.$$setParent(parent)

    if (store) {
      this.#store = new Mask(store, this.#handler, this.#queue)
      this.$$store = store
    } else if (parent?.$$store) {
      this.#store = new Mask(parent.$$store, this.#handler, this.#queue)
    }

    this.#data = data ? (typeof data === 'function' ? data.call(this) : data) : {}
    this.#proxy = new Mask(this.#data, this.#handler, this.#queue)

    this.#init()
  }

  use(plugin: any) {
    plugin(this)

    return this
  }

  component<
    D,
    M extends MethodsOptions,
    L extends ListnersOptions,
    C extends ComputedOptions
  >(name: string, config: ComponentConfig<D, M, L, C>) {
    config.name = config.name || name

    createWebComponent(config, this)

    return this
  }

  $nextTick() {
    return this.#nextTick()
  }

  $dispatchCustomEvent<T>(event: string, eventInitDict: CustomEventInit<T> = {}) {
    this.#node?.dispatchEvent(
      new CustomEvent(event, { composed: true, bubbles: true, ...eventInitDict })
    )
  }

  $dispatchEvent(event: Event) {
    this.#node?.dispatchEvent(event)
  }

  $emit(event: string, ...args: any[]) {
    if (this.$parent) this.$parent.emit(event, ...args)
  }

  async $mount(element: string | HTMLElement | null = null) {
    const _template = this.#template
    const node: HTMLElement | null = element
      ? isType('string', element)
        ? document.querySelector(element as string)
        : isType('node', element)
        ? (element as HTMLElement)
        : null
      : null

    if (_template === null || _template === undefined) {
      throw Error('A template is not supplied.')
    }

    const template = createTemplate(
      typeof _template === 'object' ? await _template : _template
    )

    this.#compile(template.content.firstElementChild)

    if (node && node.parentNode) node.parentNode.replaceChild(this.#node as Node, node)

    this.#isMounted = true

    return this as ComponentInstance<D, M, L, C>
  }

  get $toBeDestroyed() {
    return this.#toBeDestroyed
  }

  get $isDestroyed() {
    return this.#isDestroyed
  }

  get $isMounted() {
    return this.#isMounted
  }

  get $children() {
    return this.#children
  }

  get $parent() {
    return this.#parent
  }

  get $destroy() {
    return () => this.#destroy()
  }

  get $providers(): any {
    return this.#providers || this.#parent?.$providers
  }

  get $route(): any {
    return this.$router?.currentRoute
  }

  get $router(): RouterInterface | null {
    return this.#router || this.#parent?.$router || null
  }

  get $store(): Mask | null {
    return this.#store || this.#parent?.$store || null
  }

  // @ts-expect-error
  get $node() {
    return this.#el ? this.#el.node ?? null : null
  }

  get $el() {
    return this.#el
  }

  /**
   * Reactive data object.
   */
  // @ts-expect-error
  get $data() {
    return this.#proxy
  }

  /**
    Original data object. Use with caution.
    It is not reactive and should not be modified directly.
  */
  get $$data() {
    return this.#data
  }

  $getProvider(key: any): any {
    return this.$providers[key] || this.#parent?.$getProvider(key)
  }

  /**
    For internal use only
  */
  $$setParent(parent: any) {
    this.#parent = parent

    if (parent && !parent.$children.includes(this)) parent.$children.push(this)
  }

  #copyDataToInstance() {
    const proxy = this.#proxy
    const data = this.#data

    if (!proxy) return

    for (const prop of Object.keys(data)) {
      Reflect.defineProperty(this, prop, {
        enumerable: true,
        get() {
          //@ts-expect-error
          if (!proxy.isRevoked) return proxy[prop]
          else return undefined
        },
        set(value) {
          // @ts-expect-error
          if (!proxy.isRevoked && Reflect.get(proxy, prop) !== value) proxy[prop] = value
        },
      })
    }
  }

  #setComputedProperties() {
    if (!this.#computed) return

    const vm = this

    for (const [prop, desc] of Object.entries(this.#computed)) {
      let descriptor: PropertyDescriptor

      if (typeof desc === 'function') {
        const observable = attachObservable(vm)

        vm.#computedPropertyHandler.set(prop, {
          addObservable() {},
          update(data: any) {
            observable.notify({ ...data, prop })
          },
        })

        descriptor = {
          get() {
            vm.#currentComputedProperty = prop
            const value = desc.call(vm)
            vm.#currentComputedProperty = null

            return value
          },
        }
      } else {
        throw Error(`A getter is required for a computed property.`)
      }

      descriptor.enumerable = true

      Reflect.defineProperty(vm, prop, descriptor)
    }
  }

  #copyMethodsToInstance() {
    if (!this.#methods) return

    const vm = this

    Object.entries(this.#methods).forEach(([name, method]) => {
      Reflect.defineProperty(vm, name, {
        get() {
          return method.bind(vm)
        },
      })
    })
  }

  async #createComponents() {
    for (const [name, component] of Object.entries(this.#components)) {
      component.name = component.name || name

      await createWebComponent(component, this)
    }
  }

  #attachVmToRouter() {
    const router = this.#router

    if (router && !router.$vm) router.$vm = this
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
    if (!this.#listeners) return

    Object.entries(this.#listeners).forEach(([event, listener]) => {
      this.on(event, listener.bind(this))
    })
  }

  async #init() {
    this.#setListeners()

    this.emit('load')

    this.#setRefs()
    this.#inject()
    this.#copyDataToInstance()
    this.#setComputedProperties()
    this.#copyMethodsToInstance()
    this.#compile(this.#root)

    await this.#createComponents()

    if (this.#isDestroyed || this.#toBeDestroyed) return

    this.#attachVmToRouter()

    if (this.#el) {
      this.#isMounted = true

      this.emit('ready')
    }
  }

  #handleAttributeChange = (attrs: any) => {
    this.emit('attributeChanged', attrs)
  }

  #inject() {
    Object.entries(this.#dependencies).forEach(([key, value]) => {
      Reflect.defineProperty(this, key, {
        get() {
          return this.$getProvider(value)
        },
        enumerable: true,
      })
    })
  }

  #compile(element: Element | null | string = null) {
    if (element) {
      const vNode = new VNode(
        element,
        this as unknown as ComponentInstance,
        null,
        [],
        this.#node?.isCustomElement ?? false
      )
      const { node } = vNode

      vNode.on('detached', this.#destroy, this)

      if (node.on) {
        node.on('disconnected', this.#destroy)
        node.on('attributeChanged', this.#handleAttributeChange)
      }

      this.#el = vNode
      this.#node = node

      if (node && node.getAttribute('a-cloak') !== undefined) {
        node.removeAttribute('a-cloak')
      }
    }
  }

  #destroy = () => {
    if (this.#isDestroyed || this.#toBeDestroyed) return

    const vNode = this.#el
    const node = this.#node
    const parent = this.#parent
    const listeners = this.#listeners

    this.#toBeDestroyed = true

    this.emit('beforeDestroy')

    this.#proxy?.revoke()

    if (parent) {
      parent.$children.splice(
        parent.$children.indexOf(this as unknown as ComponentInstance),
        1
      )

      this.#parent = null
    }

    if (node?.on) {
      node.off('disconnected', this.#destroy)
      node.off('attributeChanged', this.#handleAttributeChange)
    }

    if (vNode) {
      vNode.$destroy()
      vNode.off('detached', this.#destroy)
    }

    if (listeners) {
      Object.entries(listeners).forEach(([event, listener]) => {
        this.off(event, listener.bind(this))
      })
    }

    this.#children.forEach(child => child.$destroy())

    this.#el = null
    this.#node = null
    this.#methods = null
    this.#listeners = null
    this.#proxy = null
    this.#handler = {}
    this.#isDestroyed = true
    this.#isMounted = false

    this.emit('destroy')
  }

  #nextTick(): Promise<void> {
    return new Promise(resolve => this.#queue.on('flushed', resolve))
  }
}
