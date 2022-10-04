import { AppConfig } from '../../signup'

const uiModal = {
  data() {
    return {
      open: false
    }
  },
  template: import(/* webpackMode: "eager" */ './modal.template.html').then(({ default: template }) => template),
  methods: {
    openModal() {
      this.open = true
    },
    closeModal() {
      this.open = false
    }
  }
} as AppConfig

export default uiModal