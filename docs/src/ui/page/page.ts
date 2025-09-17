import { defineComponent } from '@digitalbranch/app'
import { uiPageBody } from './page-body/page-body'
import { uiPageHeader } from './page-header/page-header'

import template from './page.html'
import css from './page.css'

export const uiPage = defineComponent({
  name: 'ui-page',
  css,
  template,
  components: {
    uiPageBody,
    uiPageHeader,
  },
})
