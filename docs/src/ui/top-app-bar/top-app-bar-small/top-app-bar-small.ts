import { defineComponent } from '@digitalbranch/app'

import template from './top-app-bar-small.html'
import css from './top-app-bar-small.css'

export const uiTopAppBarSmall = defineComponent({
  name: 'ui-top-app-bar-small',
  template,
  css,
  listeners: {
    ready() {
      const cssCustomPropertyHeight = (
        this.$node.shadowRoot?.adoptedStyleSheets[0].cssRules[1] as CSSStyleRule
      ).style.getPropertyValue('--ui-top-app-bar-small-height')

      this.$dispatchCustomEvent('custom-property-height', {
        detail: cssCustomPropertyHeight,
      })
    },
  },
})
