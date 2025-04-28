import { defineComponent } from '@digitalbranch/app'

const button = defineComponent({
  props: ['type'],
  template: import(/* webpackMode 'eager' */ './button.template.html').then(
    ({ default: template }) => template
  ),
  methods: {
    onClick() {
      if (this.type == 'submit')
        this.node.closest('FORM').dispatchEvent(new Event('submit'))
    },
  },
})

export default button
