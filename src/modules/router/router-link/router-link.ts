import { defineComponent } from '../../../define-component'
import { AttributeChanged } from '../../../types'

import template from './router-link.html'
import css from './router-link.css'

export const routerLink = defineComponent({
  name: 'router-link',
  template,
  css,
  props: ['to', 'active'],
  data(): any {
    return {
      to: '',
      active: false,
    }
  },
  listeners: {
    ready() {
      if (this.$router) this.$router.registerRouterLink(this)

      this.boundHandleHostKeydown = this.handleHostKeydown.bind(this)
      this.boundHandleHostClick = this.handleHostClick.bind(this)

      this.$node.setAttribute('tabindex', '0')
      this.$node.setAttribute('role', 'link')

      this.$node.addEventListener('keydown', this.boundHandleHostKeydown)
      this.$node.addEventListener('click', this.boundHandleHostClick)
    },
    beforeDestroy() {
      this.$node.removeEventListener('keydown', this.boundHandleHostKeydown)
      this.$node.removeEventListener('click', this.boundHandleHostClick)
    },
    // beforeDestroy() {
    //   if (this.$router) this.$router.unRegisterRouterLink(this)
    // },
    attributeChanged({ name, value }: AttributeChanged) {
      if (name === 'active') {
        this.$dispatchCustomEvent('routerlinkactive', {
          detail: value === 'true' || false,
        })
      }
    },
  },
  methods: {
    handleHostKeydown(e: KeyboardEvent) {
      const { key } = e

      if (key === 'Enter') this.$refs.link.click()
    },
    handleHostClick(_e: MouseEvent) {
      this.$refs.link.click()
    },
    handleOnClick(e: MouseEvent) {
      e.preventDefault()

      const ctrlKey = e.ctrlKey
      const shiftKey = e.shiftKey

      if (shiftKey || ctrlKey) return true

      this.$router?.navigate(this.to)
    },
  },
})
