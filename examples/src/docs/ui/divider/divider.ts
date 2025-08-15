import { defineComponent } from '@digitalbranch/app'

import template from './divider.html'
import css from './divider.css'

export const uiDivider = defineComponent({
  name: 'ui-divider',
  props: [
    { name: 'divider', type: 'boolean' },
    { name: 'orientation', type: 'string' },
  ],
  template,
  css,
})
