import { defineComponent } from '@digitalbranch/app'

import template from './page-body.html'
import css from './page-body.css'

export const uiPageBody = defineComponent({
  name: 'ui-page-body',
  props: [{ name: 'direction', type: 'string', default: 'column' }],
  template,
  css,
  methods: {
    handleOnScroll() {},
  },
})
