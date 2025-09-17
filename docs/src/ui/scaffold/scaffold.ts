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
  listeners: {
    ready() {
      this.boundOnCustomPropertyHeight = this.onCustomPropertyHeight.bind(this)

      this.$node.addEventListener(
        'custom-property-height',
        this.boundOnCustomPropertyHeight
      )
    },
    disconnected() {
      this.$node.removeEventListener(
        'custom-property-height',
        this.boundOnCustomPropertyHeight
      )
    },
  },
  methods: {
    onSlotChange(e: Event) {
      if (!e.target) return

      const target = e.target as HTMLSlotElement
      const { name } = target
      const hasNodes = target.assignedNodes().length > 0

      if (name === 'top-app-bar') this.hasTopAppBar = hasNodes
    },
    onCustomPropertyHeight(e: CustomEvent<string>) {
      const { detail } = e

      this.$node.shadowRoot?.adoptedStyleSheets[0].insertRule(
        `:host { --ui-top-app-bar-small-height: ${detail}; }`
      )
    },
  },
})
