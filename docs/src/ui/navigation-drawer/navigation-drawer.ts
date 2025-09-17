import { AttributeChanged, defineComponent } from '@digitalbranch/app'

import template from './navigation-drawer.html'
import css from './navigation-drawer.css'
import { getZIndex } from '../utils'

export const uiNavigationDrawer = defineComponent({
  name: 'ui-navigation-drawer',
  props: [
    { name: 'type', type: 'string', default: 'standard' },
    { name: 'open', type: 'boolean' },
  ],
  template,
  css,
  data() {
    return {
      zIndex: 3,
    }
  },
  listeners: {
    attributeChanged({ name, value }: AttributeChanged) {
      if (name === 'open') {
        if (value !== null) {
          document.body.classList.add('ui-navigation-drawer--is-open')

          this.zIndex =
            this.type === 'modal' ? getZIndex({ refElement: this.$refs.drawer }) : 3
        } else {
          document.body.classList.remove('ui-navigation-drawer--is-open')

          this.zIndex = 3
        }
      }
    },
  },
  methods: {
    handleOnClose() {
      this.$dispatchCustomEvent('close')
    },
  },
  computed: {
    drawerClasses() {
      return [
        this.type === 'modal'
          ? 'ui-navigation-drawer-modal'
          : 'ui-navigation-drawer-standard',
        this.type === 'standard'
          ? this.open
            ? 'ui-navigation-drawer-standard--is-expaned'
            : 'ui-navigation-drawer-standard--is-collapsed'
          : null,
      ]
    },
  },
})
