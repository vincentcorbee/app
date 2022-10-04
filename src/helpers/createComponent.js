import Base from '../models/Base'
import App from '../models/App'
import camelToHyphen from './camelToHyphen'
import createTemplate from './createTemplate'

const getValue = value => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

const getAttributes = props =>
  Array.isArray(props)
    ? props
    : props && typeof props === 'object'
    ? Object.keys(props).map(key => camelToHyphen(key))
    : []

const createComponent = async (config, _parent = null) => {
  const { name } = config
  const element = document.createElement(camelToHyphen(name))

  /*
    Only register the component if it is not already registered
  */

  if (!document.defaultView.customElements.get(camelToHyphen(name))) {
    const {
      props = null,
      useShadow = true,
      methods = {},
      listeners = {},
      components = {},
      router = null,
      computed = {},
    } = config
    const __attributes__ = getAttributes(props)
    const template = createTemplate(
      typeof config.template === 'object' ? await config.template : config.template
    )

    class Component extends Base {
      static get observedAttributes() {
        return __attributes__
      }

      #name = name
      #attrInstantiated = []
      #instantiated = false
      #useShadow = useShadow
      #isConnected = false
      #vm = null
      #template = template

      constructor() {
        super()

        this.dispatcher.addEvents()

        this.on('connected', () => (this.#isConnected = true))
      }

      get isCustomElement() {
        return true
      }

      get name() {
        return this.#name
      }

      get $vm() {
        return this.#vm
      }

      get isCustomElement() {
        return true
      }

      attributeChangedCallback(name, oldVal, value) {
        /*
          Does the attribute needs to be removed?
          Make sure the attributes are processed before instantiating the component.
          JSON.parse breaks the reference to the orginal object, inhibiting two way binding.
        */

        if (this.getAttribute(name)) {
          const vm = this.$vm

          value = this[name] || getValue(value)

          if (!this.#instantiated) {
            this.#attrInstantiated.push({
              name,
              value,
            })

            if (
              this.#attrInstantiated.length === __attributes__.length &&
              this.#isConnected
            ) {
              this.#instantiate()
            }
          } else if (vm && value.data !== vm[name].data) {
            vm[name] = value.data
          }
        }
      }

      disconnectedCallback() {
        const vm = this.#vm

        if (vm && !vm.isDestroyed) {
          vm.$destroy()
        }

        this.#vm = null

        this.#isConnected = false

        this.emit('disconnected')
      }

      connectedCallback() {
        if (!this.#isConnected) {
          this.#attach()

          if (
            __attributes__.length === 0 ||
            this.#attrInstantiated.length === __attributes__.length
          ) {
            this.#instantiate()
          } else {
            this.#attrInstantiated = []
          }

          this.emit('connected')
        }
      }

      #attach() {
        if (this.#useShadow) {
          if (this.shadowRoot === null) {
            const root = this.attachShadow({
              mode: 'open',
            })

            root.appendChild(this.#template.content.cloneNode(true))
          }
        } else {
          this.appendChild(document.importNode(this.#template.content, true))
        }
      }

      #getDataFromProps() {
        const data = typeof config.data === 'function' ? config.data() : config.data || {}
        const _attrInstantiated = this.#attrInstantiated

        if (props) {
          if (Array.isArray(props)) {
            this.#attrInstantiated = _attrInstantiated.filter(({ name, value }) => {
              if (props.includes(name)) {
                data[name] = value.data || value

                return false
              }

              return true
            })
          }
        }

        return data
      }

      #instantiate() {
        const data = this.#getDataFromProps()
        const parent =
          (this.$scope && this.$scope.$vm) ||
          (this.parentNode.$scope && this.parentNode.$scope.$vm) ||
          _parent ||
          config.parent

        this.#vm = new App({
          el: this,
          components,
          data,
          methods,
          listeners,
          parent,
          router,
          computed,
        })

        for (const name of Object.keys(methods)) {
          Reflect.defineProperty(this, name, {
            value: this.#vm[name],
          })
        }

        this.#instantiated = true
      }
    }

    document.defaultView.customElements.define(camelToHyphen(name), Component)
  }

  return element
}

export default createComponent
