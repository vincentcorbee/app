import { defineComponent } from '@digitalbranch/app'

import template from './button.html'
import css from './button.css'

const button = defineComponent({
  props: ['type'],
  template,
  css,
  methods: {
    onClick() {
      if (this.type == 'submit')
        this.node.closest('FORM').dispatchEvent(new Event('submit'))
    },
  },
})

export default button
