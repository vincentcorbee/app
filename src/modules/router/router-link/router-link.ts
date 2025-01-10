import { defineComponent } from '../../../define-component'

import template from './router-link.template'
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
  },
  methods: {
    handleOnClick(e: any) {
      e.preventDefault()

      const ctrlKey = e.ctrlKey
      const shiftKey = e.shiftKey

      if (shiftKey || ctrlKey) return true

      this.$router.navigate(this.to)
    },
  },
})
