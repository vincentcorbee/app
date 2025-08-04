import { defineComponent } from '../../../../../src'

import template from './home-page.template'

const homePage = defineComponent({
  name: 'homePage',
  data() {
    return {
      title: 'Home',
    }
  },
  template,
})

export default homePage
