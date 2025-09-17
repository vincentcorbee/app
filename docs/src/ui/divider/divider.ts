import { defineComponent } from '@digitalbranch/app'

import template from './divider.html'
import css from './divider.css'

export const uiDivider = defineComponent({
  name: 'ui-divider',
  props: [
    { name: 'in-list', type: 'boolean', default: false },
    { name: 'orientation', type: 'string', default: 'horizontal' },
    { name: 'variant', type: 'string', default: 'inset' },
  ],
  template,
  css,
})
