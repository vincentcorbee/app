import { defineComponent } from '@digitalbranch/app'
import { uiRipple } from '../../ripple/ripple'

import template from './icon-button.html'
import css from './icon-button.css'

export const uiIconButton = defineComponent({
  name: 'ui-icon-button',
  props: ['type', { name: 'disabled', type: 'boolean' }],
  components: {
    uiRipple,
  },
  template,
  css,
  formAssociated: true,
  delegatesFocus: false,
  listeners: {
    ready() {
      this.boundHandleFocus = this.handleFocus.bind(this)
      this.$node.setAttribute('tabindex', '0')
      this.$node.setAttribute('role', this.to || this.href ? 'link' : 'button')

      this.$node.addEventListener('focus', this.boundHandleFocus)
    },
    beforeDestroy() {
      this.$node.removeEventListener('focus', this.boundHandleFocus)
    },
  },
  methods: {
    handleFocus() {
      this.$refs.button.focus()
    },
    onClick() {
      if (this.type === 'submit') {
        ;(this.$node as any).form?.dispatchEvent(new Event('submit'))
      }
    },
  },
})
