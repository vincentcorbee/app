import { defineComponent } from '@digitalbranch/app'

import template from './card.html'
import css from './card.css'

export const uiCard = defineComponent({
  name: 'ui-card',
  props: [{ name: 'variant', type: 'string', default: 'filled' }],
  template,
  css,
})
