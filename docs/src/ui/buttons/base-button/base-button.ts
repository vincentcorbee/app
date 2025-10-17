import { defineComponent } from '@digitalbranch/app'

import { uiFocusRing } from '../../focus-ring/focus-ring'

import template from './base-button.html'
import css from './base-button.css'

function hasNonEmptyChildNodes(slot: HTMLSlotElement) {
  return slot.assignedNodes({ flatten: true }).some(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent && node.textContent.trim().length > 0
    }
    return node.nodeType === Node.ELEMENT_NODE
  })
}

export const uiBaseButton = defineComponent({
  name: 'ui-base-button',
  props: ['type', { name: 'disabled', type: 'boolean' }, 'to', 'href'],
  components: {
    uiFocusRing,
  },
  template,
  css,
  data() {
    return {
      hasIconStart: false,
      hasIconEnd: false,
      hasLabel: false,
      hasFocus: false,
    }
  },
  formAssociated: true,
  delegatesFocus: true,
  listeners: {
    ready() {
      this.boundHandleFocus = this.handleFocus.bind(this)
      this.boundHandleFocusOut = this.handleFocusOut.bind(this)

      this.$node.setAttribute('tabindex', '0')
      this.$node.setAttribute('role', this.to || this.href ? 'link' : 'button')

      this.$node.addEventListener('focus', this.boundHandleFocus)
      this.$node.addEventListener('focusout', this.boundHandleFocusOut)
    },
    beforeDestroy() {
      this.$node.removeEventListener('focus', this.boundHandleFocus)
      this.$node.removeEventListener('focusout', this.boundHandleFocusOut)
    },
  },
  methods: {
    handleSlotChange(e: Event) {
      const target = e.target as HTMLSlotElement

      if (!target) return

      const { name, assignedSlot } = target
      const hasNodes = hasNonEmptyChildNodes(target)

      if (name === 'icon-start' || assignedSlot?.name === 'icon-start') {
        this.hasIconStart = hasNodes
      } else if (name === 'icon-end') {
        this.hasIconEnd = hasNodes
      } else if (name === '') {
        this.hasLabel = hasNodes
      }
    },
    handleFocus() {
      this.hasFocus = true
    },
    handleFocusOut() {
      this.hasFocus = false
    },
    handleClick() {
      if (this.type === 'submit') {
        // @ts-expect-error
        this.$node.form?.dispatchEvent(new Event('submit'))
      }
    },
  },
  computed: {
    buttonClasses() {
      return [
        this.hasLabel && 'ui-button--has-label',
        this.hasIconStart && 'ui-button--has-icon-start',
        this.hasIconEnd && 'ui-button--has-icon-end',
      ]
    },
  },
})
