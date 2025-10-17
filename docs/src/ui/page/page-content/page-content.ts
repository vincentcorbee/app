import { defineComponent } from '@digitalbranch/app'

import template from './page-content.html'
import css from './page-content.css'

export const uiPageContent = defineComponent({
  name: 'ui-page-content',
  props: [{ name: 'direction', type: 'string', default: 'column' }],
  css,
  template,
})
