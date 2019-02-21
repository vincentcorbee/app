import Base from '../models/Base'
import camelToHyphen from './camelToHyphen'
import createTemplate from './createTemplate'
import insertTemplate from './insertTemplate'

const createComponent = (component, parent = null) => {
  ;(async () => {
    const _private = new WeakMap()
    const template = createTemplate(component.template)
    const props = component.props || null
    const components = component.components || {}
    let __attributes__ = []
    let attrInstantiated = []
    let instantiated = false
    if (Array.isArray(props)) {
      __attributes__ = props
    } else if (typeof props === 'object') {
      for (const key in __attributes__) {
        if (__attributes__.hasOwnProperty(key)) {
          key = camelToHyphen(key)
          __attributes__.push(key)
        }
      }
    }
    class Component extends Base {
      static get observedAttributes() {
        return __attributes__
      }
      constructor() {
        super()
        const self = this
        const instantiate = self => {
          let { props, components, parent, attrInstantiated } = _private.get(self)
          let data = component.data ? component.data() : {}
          let methods = component.methods || {}
          let listeners = component.listeners || {}
          let el = self.shadowRoot.firstElementChild
          if (props) {
            if (Array.isArray(props)) {
              props.forEach(
                prop =>
                  (data[prop] = (
                    attrInstantiated.find(attr => attr.name === prop) || {}
                  ).value)
              )
            }
          }
          // Create new App instance
          // This keeps overwriting the component vm
          _private.get(self).vm = new App({
            el,
            data,
            methods,
            listeners,
            parent
          })

          // This still adds a child that has no reference in the DOM from a for directive
          // I don't think this works very well
          // Create child components
          for (const name in components) {
            components[name].name = components[name].name || name
            createComponent(components[name], _private.get(self).vm)
          }
          _private.get(self).instantiated = true
        }
        self.dispatcher.addEvents()
        _private.set(self, {
          name,
          props,
          __attributes__,
          attrInstantiated,
          instantiated,
          instantiate,
          components,
          parent,
          vm: null
        })
      }
      get name() {
        return _private.get(this).name
      }
      // templateUrl() {
      //   return ''
      // }
      attributeChangedCallback(attrName, oldVal, newVal) {
        const self = this
        const { attrInstantiated, __attributes__, instantiate } = _private.get(self)
        // Does the attribute needs to be removed?
        // Make sure the attributes are processed before instantiating the component
        // JSON.stringify breaks the reference to the orginal object,
        // basically inhibiting two way binding
        if (self.getAttribute(attrName)) {
          newVal = self[attrName] || JSON.parse(newVal)
          if (self[attrName] !== undefined) {
            self[attrName] = null
          }
          if (!_private.get(self).instantiated) {
            attrInstantiated.push({
              name: attrName,
              value: newVal
            })
            if (attrInstantiated.length === __attributes__.length) {
              instantiate(self)
            }
          } else {
            _private.get(self).vm[attrName] = newVal
          }
        }
      }
      disconnectedCallback() {
        if (_private.get(this).vm) {
          if (!_private.get(this).vm.isDestroyed) {
            _private.get(this).vm.$destroy()
          }
          _private.get(this).vm = null
        }
      }
      connectedCallback() {
        let self = this
        const { instantiate } = _private.get(self)
        if (self.shadowRoot === null) {
          const root = self.attachShadow({
            mode: 'open'
          })
          insertTemplate(template, root)
          if (__attributes__.length === 0) {
            instantiate(self)
          } else {
            _private.get(self).attrInstantiated = []
          }
        }
      }
    }
    document.defaultView.customElements.define(camelToHyphen(component.name), Component)
  })()
}
export default createComponent
