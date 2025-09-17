import { defineComponent } from '@digitalbranch/app'

import template from './main.html'
import css from './main.css'

export const main = defineComponent({
  name: 'app-main',
  template,
  css,
  data() {
    return {
      colorScheme: 'dark',
      colorSchemeIcon: 'light_mode',
    }
  },
  methods: {
    onChangeColorScheme() {
      const { colorScheme } = this
      const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark'

      this.colorScheme = newColorScheme
      this.colorSchemeIcon = `${colorScheme}_mode`

      document.documentElement.setAttribute('data-mode', newColorScheme)
    },
  },
})
