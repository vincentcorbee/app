import { Encapsulation } from '../../../constants'
import { defineComponent } from '../../../define-component'

import template from './router-view.template'

export const routerView = defineComponent({
  name: 'router-view',
  props: ['name'],
  encapsulation: Encapsulation.shadowDom,
  template,
  data() {
    return {
      name: 'default',
    }
  },
})
