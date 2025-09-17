import { defineComponent } from '@digitalbranch/app'

import template from './icon-button.html'
import css from './icon-button.css'

export const uiIconButton = defineComponent({
  name: 'ui-icon-button',
  props: ['type', { name: 'disabled', type: 'boolean' }],
  template,
  css,
  formAssociated: true,
  methods: {
    onClick() {
      if (this.type === 'submit') {
        ;(this.$node as any).form?.dispatchEvent(new Event('submit'))
      }
    },
  },
})
