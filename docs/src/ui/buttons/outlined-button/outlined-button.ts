import { defineComponent } from '@digitalbranch/app'

import template from './outlined-button.html'
import css from './outlined-button.css'

export const uiOutlinedButton = defineComponent({
  name: 'ui-outlined-button',
  props: ['type', { name: 'disabled', type: 'boolean' }],
  template,
  css,
  formAssociated: true,
  methods: {
    onClick() {
      if (this.type === 'submit') {
        // @ts-expect-error
        this.$node.form?.dispatchEvent(new Event('submit'))
      }
    },
  },
})
