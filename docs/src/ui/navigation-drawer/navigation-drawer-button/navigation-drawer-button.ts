import { AttributeChanged, defineComponent } from '@digitalbranch/app'
import { uiBaseButton } from '../../buttons/base-button/base-button'

import template from './navigation-drawer-button.html'
import css from './navigation-drawer-button.css'

export const uiNavigationDrawerButton = defineComponent({
  name: 'ui-navigation-drawer-button',
  props: [{ name: 'active', type: 'boolean' }, 'to', 'href', 'active'],
  components: {
    uiBaseButton,
  },
  template,
  css,
  data() {
    return {
      hasIcon: false,
      hasLabel: true,
      active: false,
    }
  },
  methods: {
    onSlotChange(e: any) {
      const { target } = e
      const { name } = target
      const hasNodes = target.assignedNodes().length > 0

      if (name === undefined) this.hasLabel = hasNodes
      else if (name === 'icon-start') this.hasIcon = hasNodes
    },
    onRouterLinkActive(e: CustomEvent<boolean>) {
      this.active = e.detail
    },
  },
})
