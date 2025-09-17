import { defineComponent } from '@digitalbranch/app'

import template from './page-header.html'
import css from './page-header.css'

export const uiPageHeader = defineComponent({
  name: 'ui-page-header',
  css,
  template,
  data() {
    return {
      hasTabs: false,
    }
  },
})
