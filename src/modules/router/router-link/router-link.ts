import { defineComponent } from '../../../define-component'
import { AttributeChanged } from '../../../types'

import template from './router-link.html'
import css from './router-link.css'

export const routerLink = defineComponent({
  name: 'router-link',
  template,
  css,
  props: ['to', 'className', 'active'],
  data() {
    return {
      to: '',
      className: '',
      active: false,
    }
  },
  listeners: {
    ready() {
      if (this.$router) this.$router.registerRouterLink(this)
    },
    beforeDestroy() {
      if (this.$router) this.$router.unRegisterRouterLink(this)
    },
    attributeChanged({ name, value }: AttributeChanged) {
      if (name === 'active') {
        this.$dispatchCustomEvent('routerlinkactive', {
          detail: value === 'true' || false,
        })
      }
    },
  },
  methods: {
    handleOnClick(e: any) {
      e.preventDefault()

      const ctrlKey = e.ctrlKey
      const shiftKey = e.shiftKey

      if (shiftKey || ctrlKey) return true

      this.$router?.navigate(this.to)
    },
  },
})
