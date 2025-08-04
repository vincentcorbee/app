import { defineComponent } from '@digitalbranch/app'

import template from './input.html'
import css from './input.css'

const uiInput = defineComponent({
  props: ['type', 'value'],
  template,
  css,
  methods: {
    onInput(e: Event) {
      const target = e.target as HTMLInputElement

      this.$emit('update', target.value)
    },
  },
})

export default uiInput
