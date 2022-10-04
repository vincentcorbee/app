import { AppConfig } from '../../signup'

const button = {
  props: ['type'],
  template: import(/* webpackMode 'eager' */ './button.template.html').then(({ default: template }) => template),
  methods: {
    onClick() {
      if (this.type == 'submit') {
        this.node.closest('FORM').dispatchEvent(new Event('submit'))
      }
      console.dir(this)
    }
  }
} as AppConfig

export default button