import { defineComponent } from '@digitalbranch/app'

import template from './main.html'
import css from './main.css'

export const main = defineComponent({
  name: 'app-main',
  template,
  css,
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      loading: true,
    }
  },
  listeners: {
    ready() {
      setTimeout(async () => {
        this.loading = false
      }, 1000)
    },
  },
})
