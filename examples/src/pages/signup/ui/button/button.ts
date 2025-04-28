import { defineComponent } from '@digitalbranch/app'

import template from './button.template'

const button = defineComponent({
  props: ['type'],
  template,
  methods: {
    onClick() {
      if (this.type === 'submit')
        (this.$node as HTMLElement).closest('FORM')?.dispatchEvent(new Event('submit'))
    },
  },
})

export default button
