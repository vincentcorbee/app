import { AttributeChanged, defineComponent } from '@digitalbranch/app'

import css from './focus-ring.css'

export const uiFocusRing = defineComponent({
  name: 'ui-focus-ring',
  props: [{ name: 'visible', type: 'boolean' }],
  data() {
    return {
      visible: false,
    }
  },
  css,
  listeners: {
    ready() {
      console.log(this.visible)
      this.setVisibility(this.visible)
    },
    attributeChanged(e: AttributeChanged) {
      const { name, value } = e

      console.log(name, value)

      if (name === 'visible') {
        this.setVisibility(value !== null)
      }
    },
  },
  methods: {
    setVisibility(state: boolean) {
      this.$node.setAttribute('aria-hidden', state ? 'false' : 'true')
    },
  },
})
