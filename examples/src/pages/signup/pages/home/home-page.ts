import { defineComponent } from '../../../../../../src'

import template from './home-page.template'

const homePage = defineComponent({
  name: 'homePage',
  data() {
    return {
      title: 'Home',
      myValue: '',
    }
  },
  template,
  methods: {
    onInput(e: Event) {
      this.myValue = (e.target as HTMLInputElement).value
    },
  },
})

export default homePage
