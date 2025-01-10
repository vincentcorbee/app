import Base from '../modules/base'
import App from '../modules/app'
import camelToHyphen from './camel-to-hyphen'
import createTemplate from './create-template'
import { hyphenToCamel } from './hyphen-to-camel'
import {
  ComponentConfig,
  ComputedOptions,
  ListnersOptions,
  MethodsOptions,
  PropDefinition,
  Props,
  PropType,
} from '../types'
import { Encapsulation } from '../constants'

type Attribute = { name: string; propertyName: string; value: any }

const DEFAULT_CSS = `* { box-sizing: border-box; }`

const getValue = (value: any) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

const getCastedValue = (value: any, type: PropType) => {
  switch (type) {
    case null:
      return null
    case 'boolean':
      /* empty string is for casting boolean attribute */
      return value === ''
        ? true
        : value === 'true'
        ? true
        : value === 'false'
        ? false
        : Boolean(value)
    case 'number':
      return Number(value)
    case 'object':
      return typeof value === 'object' ? value : getValue(value)
    case 'array':
      return Array.isArray(value) ? value : getValue(value)
    case 'date':
      return value instanceof Date ? value : new Date(value)
    case 'string':
      return typeof value === 'string' ? value : String(value)
    case 'any':
    default:
      return value
  }
}

const getAttributes = (props?: Props | null) =>
  Array.isArray(props)
    ? props.map(prop => camelToHyphen(typeof prop === 'string' ? prop : prop.name))
    : props && typeof props === 'object'
    ? Object.keys(props).map(key => camelToHyphen(key))
    : []

const createWebComponent = async <
  D,
  M extends MethodsOptions,
  L extends ListnersOptions,
  C extends ComputedOptions
>(
  config: ComponentConfig<D, M, L, C>,
  _parent: App<any, any, any, any> | null = null
) => {
  const { name } = config
  const elementName = camelToHyphen(name)
  const element = document.createElement(elementName)

  /*
    Only register the component if it is not already registered
  */

  if (!document.defaultView?.customElements.get(elementName)) {
    App.registeredWebComponents.add(elementName)

    const {
      props = null,
      encapsulation = Encapsulation.shadowDom,
      methods = {},
      listeners = {},
      components = {},
      router = null,
      computed = null,
      template = '',
      css,
      formAssociated,
      inject,
      provide,
    } = config
    const __attributes__ = getAttributes(props)
    const $template = createTemplate(
      template instanceof Promise ? await template : template
    )
    const $css = css ? new CSSStyleSheet() : null

    if ($css) $css.replaceSync(`${DEFAULT_CSS}${css!}`)

    class Component extends Base {
      static get formAssociated() {
        return formAssociated
      }

      static get observedAttributes() {
        return __attributes__
      }

      #name = elementName
      #instantiatedAttributes: Map<string, Attribute> = new Map()
      #instantiated = false
      #encapsulation = encapsulation
      #isConnected = false
      #vm: any | null = null
      #template = $template
      #css = $css
      #requiredAttributesCount = __attributes__.length
      #internals: ElementInternals | null = null

      constructor() {
        super()

        if (formAssociated) this.#internals = this.attachInternals()

        this.dispatcher.addEvents()

        this.on('connected', () => (this.#isConnected = true))
      }

      get $name() {
        return this.#name
      }

      get $vm() {
        return this.#vm
      }

      get $internals() {
        return this.#internals
      }

      get isCustomElement() {
        return true
      }

      get form() {
        return this.#internals?.form
      }

      attributeChangedCallback(name: string, oldValue: string, value: string) {
        /*
          Make sure the attributes are processed before instantiating the component.
          JSON.parse breaks the reference to the orginal object.
        */

        const propertyName = hyphenToCamel(name)

        if (this.hasAttribute(name)) {
          const vm = this.$vm

          // @ts-ignore
          const modelValue = this[propertyName] ?? getValue(value)

          if (!this.#instantiated) {
            /*
              This is to keep track of the attributes that have been instantiated
              Should be changed to a set
            */
            if (!this.#instantiatedAttributes.has(name))
              this.#instantiatedAttributes.set(propertyName, {
                name,
                propertyName,
                value: modelValue,
              })

            if (
              this.#instantiatedAttributes.size === this.#requiredAttributesCount &&
              this.#isConnected
            ) {
              this.#instantiate()
            }
          } else if (vm && modelValue.data !== vm[propertyName]?.data) {
            vm[propertyName] = modelValue.data
          } else if (vm && modelValue !== vm[propertyName]) {
            vm[propertyName] = modelValue
          }
        }

        if (!Reflect.has(this, propertyName)) {
          Reflect.defineProperty(this, propertyName, {
            get() {
              if (!this.$vm) return undefined
              return this.$vm[propertyName]
            },
            set(value) {
              this.$vm[propertyName] = value
            },
          })
        }

        this.emit('attributeChanged', { name, value, oldValue })
      }

      disconnectedCallback() {
        this.#vm = null
        this.#isConnected = false

        this.emit('disconnected')
      }

      connectedCallback() {
        if (!this.#isConnected) {
          this.#setRequiredAttributeCount()

          this.#attach()

          if (
            this.#requiredAttributesCount === 0 ||
            this.#instantiatedAttributes.size === this.#requiredAttributesCount
          ) {
            this.#instantiate()
          } else {
            this.#instantiatedAttributes = new Map()
          }

          this.emit('connected')
        }
      }

      /**
       * All props are optional, so only get the count of the attributes that are on the html element
       */
      #setRequiredAttributeCount() {
        this.#requiredAttributesCount = __attributes__.filter(attr =>
          Boolean(this.attributes.getNamedItem(attr))
        ).length
      }

      #attach() {
        if (this.#encapsulation === Encapsulation.shadowDom) {
          if (this.shadowRoot === null) {
            const root = this.attachShadow({
              mode: 'open',
            })

            if (this.#template) root.appendChild(this.#template.content.cloneNode(true))

            if (this.#css) root.adoptedStyleSheets.push(this.#css)
          }
        } else if (this.#template) {
          this.appendChild(document.importNode(this.#template.content, true))

          // if (this.#css) {
          //   document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.#css]
          // }
        }
      }

      #getDataFromProps() {
        const data = typeof config.data === 'function' ? config.data() : config.data || {}

        if (props) {
          const instantiatedAttributes = this.#instantiatedAttributes

          if (Array.isArray(props)) {
            props.forEach(prop => {
              const config: PropDefinition =
                typeof prop === 'string' ? { name: prop, type: 'string' } : prop

              const attr = instantiatedAttributes.get(config.name)

              if (attr) {
                const castedValue = getCastedValue(attr.value, config.type)

                data[config.name] = castedValue

                instantiatedAttributes.delete(config.name)
              } else {
                if (Reflect.has(config, 'default')) {
                  data[config.name] = config.default
                }

                if (config.required) {
                  console.warn(`The attribute ${config.name} is required`)
                }
              }
            })
          }
        }

        return data
      }

      #instantiate() {
        const data = this.#getDataFromProps()

        let parent = (_parent || config.parent) ?? null

        if (this.$scope && this.$scope.$vm) parent = this.$scope.$vm
        else {
          let parentNode = this.parentNode

          while (parentNode) {
            if (parentNode.host) parentNode = parentNode.host

            if (parentNode.$scope && parentNode.$scope.$vm) {
              parent = parentNode.$scope.$vm

              break
            } else if (parentNode.on) {
              parentNode.on('connected', () => {
                if (this.#isConnected) this.#vm.$$setParent(parentNode.$vm)
              })

              break
            } else if (parentNode.$vm) {
              parent = parentNode.$vm

              break
            }

            parentNode = parentNode.parentNode
          }
        }

        this.#vm = new App({
          el: this,
          components,
          data,
          methods,
          listeners,
          parent,
          router,
          computed,
          inject,
          provide,
        })

        Object.keys(methods).forEach(name =>
          Reflect.defineProperty(this, name, {
            value: this.#vm[name],
          })
        )

        this.#instantiated = true
      }
    }

    document.defaultView?.customElements.define(elementName, Component)
  }

  return element
}

export default createWebComponent
