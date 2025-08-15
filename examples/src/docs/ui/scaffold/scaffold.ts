import { defineComponent } from '@digitalbranch/app'

import template from './scaffold.html'
import css from './scaffold.css'

export const scaffold = defineComponent({
  name: 'ui-scaffold',
  template,
  css,
  data() {
    return {
      hasTopAppBar: false,
    }
  },
  methods: {
    onSlotChange(e: Event) {
      if (!e.target) return

      const target = e.target as HTMLSlotElement
      const { name } = target
      const hasNodes = target.assignedNodes().length > 0

      if (name === 'top-app-bar') {
        this.hasTopAppBar = hasNodes
      }
    },
  },
})
