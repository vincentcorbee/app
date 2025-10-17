import { AttributeChanged, defineComponent } from '@digitalbranch/app'

import template from './navigation-rail.html'
import css from './navigation-rail.css'

export const uiNavigationRail = defineComponent({
  name: 'ui-navigation-rail',
  template,
  css,
  listeners: {
    attributeChanged({ name, value }: AttributeChanged) {},
  },
  methods: {
    handleClose() {
      this.$dispatchCustomEvent('close')
    },
  },
})
