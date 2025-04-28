import { defineComponent } from '@digitalbranch/app'

import template from './modal.template'

const uiModal = defineComponent({
  data() {
    return {
      open: false,
    }
  },
  template,
  methods: {
    openModal() {
      this.open = true
    },
    closeModal() {
      this.open = false
    },
  },
})

export default uiModal
