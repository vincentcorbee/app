import { defineComponent } from '@digitalbranch/app'

import template from './heading.html'
import css from './heading.css'

export const uiHeading = defineComponent({
  name: 'ui-heading',
  props: [{ name: 'type', type: 'string', required: true }],
  template,
  css,
})
