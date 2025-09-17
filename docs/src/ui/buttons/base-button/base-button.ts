import { defineComponent } from '@digitalbranch/app'

import template from './base-button.html'
import css from './base-button.css'

export const uiBaseButton = defineComponent({
  name: 'ui-base-button',
  props: ['type', { name: 'disabled', type: 'boolean' }, 'to', 'href'],
  template,
  css,
  formAssociated: true,
  methods: {
    onSlotChange(e: Event) {
      console.log('base-button: not implemented')
    },
    onClick() {
      if (this.type === 'submit') {
        // @ts-expect-error
        this.$node.form?.dispatchEvent(new Event('submit'))
      }
    },
  },
})
