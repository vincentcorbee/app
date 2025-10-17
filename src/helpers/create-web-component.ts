import BaseComponent from '../modules/base-component'
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
  ComponentProps,
  PropType,
} from '../types'
import { Encapsulation } from '../constants'
import ArrayMask from '../modules/array-mask'
import Mask from '../modules/mask'
import { hyphenToPascal } from './hyphen-to-pascal'

type Attribute = { name: string; propertyName: string; value: any }

const DEFAULT_CSS = /* css */ `
* {
  box-sizing: border-box;
}`

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
      return typeof value === 'object' || value instanceof Mask ? value : getValue(value)
    case 'array':
      return Array.isArray(value) || value instanceof ArrayMask ? value : getValue(value)
    case 'date':
      return value instanceof Date ? value : new Date(value)
    case 'string':
      return typeof value === 'string' ? value : String(value)
    case 'any':
    default:
      return value
  }
}

const getAttributes = (props?: ComponentProps | null) =>
  Array.isArray(props)
    ? props.map(prop => camelToHyphen(typeof prop === 'string' ? prop : prop.name))
    : props && typeof props === 'object'
    ? Object.keys(props).map(key => camelToHyphen(key))
    : []

export const createWebComponent = async <
  D,
  M extends MethodsOptions,
  L extends ListnersOptions,
  C extends ComputedOptions
>(
  config: ComponentConfig<D, M, L, C>,
  _parent: App<any, any, any, any> | null = null
) => {
  const { name } = config

  if (!name) throw new Error('Name for web component is required')

  const elementName = camelToHyphen(name)
  const element = document.createElement(elementName)

  /*
    Only register the component if it is not already registered
  */
  if (!App.registeredWebComponents.has(elementName)) {
    App.registeredWebComponents.add(elementName)

    const {
      props = null,
      encapsulation = Encapsulation.shadowDom,
      methods = {},
      listeners = {},
      components = {},
      router,
      computed,
      template = '',
      css,
      formAssociated,
      inject,
      provide,
      delegatesFocus = false,
    } = config
    const __attributes__ = getAttributes(props)
    const $template = createTemplate(
      template instanceof Promise ? await template : template
    )
    const $css = css ? new CSSStyleSheet() : null

    if ($css) $css.replaceSync(`${DEFAULT_CSS}${css!}`)

    class CustomElement extends BaseComponent {
      static get formAssociated() {
        return formAssociated
      }

      static get observedAttributes() {
        return __attributes__
      }

      static get name() {
        return hyphenToPascal(elementName)
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
        const propertyName = hyphenToCamel(name)

        if (this.hasAttribute(name) || value === null) {
          const vm = this.$vm

          if (!this.#instantiated) {
            // @ts-ignore
            const propertyValue = this[propertyName] ?? getValue(value)

            this.#setInstantiatedAttributes(name, propertyName, propertyValue)

            if (this.#shouldInstantiate()) this.#instantiate()
          } else {
            const propertyValue = this.#getPropertyValue(
              propertyName,
              // @ts-ignore
              this[propertyName] ?? getValue(value)
            )

            if (vm && propertyValue.data !== vm[propertyName]?.data) {
              vm[propertyName] = propertyValue.data
            } else if (vm && propertyValue !== vm[propertyName]) {
              vm[propertyName] = propertyValue
            }
          }
        }

        this.#defineProperty(propertyName)

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

      #getPropertyDefinition(propertyName: string): PropDefinition | null {
        if (!props) return null

        if (!Array.isArray(props)) return null

        for (let i = 0; i < props.length; i++) {
          const prop = props[i]
          const definition: PropDefinition =
            typeof prop === 'string' ? { name: prop, type: 'string' } : prop

          if (definition.name === propertyName) return definition
        }

        return null
      }

      #getPropertyValue(propertyName: string, value: string) {
        const definition = this.#getPropertyDefinition(propertyName)

        if (definition) return getCastedValue(value, definition.type)

        return value
      }

      /**
        Make sure the attributes are processed before instantiating the component.
      */
      #shouldInstantiate() {
        return (
          this.#instantiatedAttributes.size === this.#requiredAttributesCount &&
          this.#isConnected
        )
      }

      /**
        Keeps track of the attributes that have been instantiated

        @Todo Should be changed to a set.
      */
      #setInstantiatedAttributes(name: string, propertyName: string, value: any) {
        if (!this.#instantiatedAttributes.has(propertyName)) {
          this.#instantiatedAttributes.set(propertyName, {
            name,
            propertyName,
            value,
          })
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

      /**
        Define a property on the component instance
      */
      #defineProperty(name: string) {
        if (!Reflect.has(this, name)) {
          Reflect.defineProperty(this, name, {
            get() {
              if (!this.$vm) return undefined

              return this.$vm[name]
            },
            set(value) {
              this.$vm[name] = value
            },
          })
        }
      }

      #attach() {
        if (this.#encapsulation === Encapsulation.shadowDom) {
          if (this.shadowRoot === null) {
            const root = this.attachShadow({
              mode: 'open',
              delegatesFocus,
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

      #getDataFromProps(source: any, props: ComponentProps | null = null) {
        const data = typeof source === 'function' ? source() : source || {}

        if (props) {
          const instantiatedAttributes = this.#instantiatedAttributes

          if (Array.isArray(props)) {
            props.forEach(prop => {
              const definition: PropDefinition =
                typeof prop === 'string' ? { name: prop, type: 'string' } : prop

              const attr = instantiatedAttributes.get(definition.name)

              if (attr) {
                const castedValue = getCastedValue(attr.value, definition.type)

                data[definition.name] = castedValue

                instantiatedAttributes.delete(definition.name)
              } else {
                if (Reflect.has(definition, 'default')) {
                  data[definition.name] = definition.default
                } else {
                  data[definition.name] = undefined
                }

                if (definition.required) {
                  console.warn(`The attribute ${definition.name} is required`)
                }
              }
            })
          }
        }

        return data
      }

      #instantiate() {
        let parent = (_parent || config.parent) ?? null

        // @ts-expect-error
        if (this.$scope && this.$scope.$vm) parent = this.$scope.$vm
        else {
          let parentNode = this.parentNode

          while (parentNode) {
            // @ts-expect-error
            if (parentNode.host) parentNode = parentNode.host
            // @ts-expect-error
            if (parentNode?.$scope && parentNode.$scope.$vm) {
              // @ts-expect-error
              parent = parentNode.$scope.$vm

              break
            }
            // @ts-expect-error
            else if (parentNode?.on) {
              // @ts-expect-error
              parentNode.on('connected', () => {
                // @ts-expect-error
                if (this.#isConnected) this.#vm.$$setParent(parentNode?.$vm)
              })

              break
            }
            // @ts-expect-error
            else if (parentNode?.$vm) {
              // @ts-expect-error
              parent = parentNode.$vm

              break
            }

            parentNode = parentNode?.parentNode ?? null
          }
        }
        const data = this.#getDataFromProps(config.data, props)

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

        this.#instantiatedAttributes = new Map()
        this.#instantiated = true
      }
    }

    document.defaultView?.customElements.define(
      elementName,
      CustomElement as unknown as CustomElementConstructor
    )
  }

  await document.defaultView?.customElements.whenDefined(elementName)

  return element
}

export default createWebComponent
