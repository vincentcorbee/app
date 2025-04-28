import { Encapsulation } from '../../../constants'
import { defineComponent } from '../../../define-component'

import template from './router-view.template'

export const routerView = defineComponent({
  name: 'router-view',
  props: ['name'],
  encapsulation: Encapsulation.shadowDom,
  template,
  css: `:host { display: block; }`,
  data() {
    return {
      name: 'default',
    }
  },
  // listeners: {
  //   ready() {
  //     this.$router.registerRouterView(this)
  //   },
  //   beforeDestroy() {
  //     console.log(this)
  //     this.$router.unRegisterRouterView(this)
  //   },
  // },
})
