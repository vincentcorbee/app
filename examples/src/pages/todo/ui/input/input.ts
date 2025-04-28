import { defineComponent } from '@digitalbranch/app'

const uiInput = defineComponent({
  props: ['type', 'value'],
  template: import(/* webpackMode 'eager' */ './input.template.html').then(
    ({ default: template }) => template
  ),
  methods: {
    onInput(e: Event) {
      const target = e.target as HTMLInputElement

      this.$emit('update', target.value)
    },
  },
})

export default uiInput
