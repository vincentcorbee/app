import { defineComponent } from '@digitalbranch/app'

import template from './icon.html'
import css from './icon.css'
import { uiBaseButton } from '../buttons/base-button/base-button'

export const uiIcon = defineComponent({
  name: 'ui-icon',
  template,
  css,
  props: ['icon', 'fill'],
  components: {
    uiBaseButton,
  },
  inject: ['icons'],
  data() {
    return {
      icon: '',
      fill: 1,
      loading: true,
    }
  },
  listeners: {
    async compiled() {
      await this.addFont()

      this.setState()
    },
  },
  methods: {
    async setState() {
      await document.fonts.load('24px "Material Symbols Outlined"')

      this.loading = false
    },
    async addFont() {
      return new Promise<void>(resolve => {
        const id = `ui-icon-font`
        const currentStyle = document.getElementById(id)

        if (currentStyle && currentStyle.dataset.loaded !== undefined) {
          resolve()
        } else if (currentStyle) {
          currentStyle.addEventListener('load', async () => {
            requestAnimationFrame(() => {
              resolve()
            })
          })
        } else {
          const { icons } = this
          const style = document.createElement('link')

          style.id = id
          style.setAttribute(
            'href',
            `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${icons.join(
              ','
            )}&display=block`
          )

          style.setAttribute('rel', 'stylesheet')

          style.addEventListener('load', async () => {
            requestAnimationFrame(() => {
              style.dataset.loaded = ''

              resolve()
            })
          })

          document.head.appendChild(style)
        }
      })
    },
  },
})
