import { defineComponent } from '@digitalbranch/app'
import { uiBaseButton } from '../../buttons/base-button/base-button'

import template from './navigation-rail-button.html'
import css from './navigation-rail-button.css'

export const uiNavigationRailButton = defineComponent({
  name: 'ui-navigation-rail-button',
  props: [{ name: 'active', type: 'boolean' }, 'to', 'href', 'active'],
  components: {
    uiBaseButton,
  },
  template,
  css,
  data() {
    return {
      hasLabel: true,
      hasIcon: false,
      active: false,
    }
  },
  computed: {
    buttonClasses() {
      return [
        this.hasLabel && 'ui-navigation-rail-button--has-label',
        this.hasIcon && `ui-navigation-rail-button--has-icon`,
        this.active && 'ui-navigation-rail-button--is-active',
      ]
    },
  },
  methods: {
    onSlotChange(e: any) {
      const { target } = e
      const { name } = target
      const hasNodes = target.assignedNodes().length > 0

      if (name === undefined) this.hasLabel = hasNodes
      else if (name === 'icon') this.hasIcon = hasNodes
    },
    onRouterLinkActive(e: CustomEvent<boolean>) {
      this.active = e.detail
    },
  },
})
