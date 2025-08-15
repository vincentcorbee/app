import { Form, FormControl, defineComponent, requiredValidator } from '@digitalbranch/app'

import template from './login-page.template'

const validators = {
  required: requiredValidator,
}

const loginPage = defineComponent({
  name: 'loginPage',
  template,
  data() {
    return {
      title: 'Login',
      password: '',
      username: '',
      passone: '',
      passtwo: '',
      login: new Form({
        username: new FormControl({ value: '', validators }),
        password: new FormControl({ value: '', validators }),
      }),
    }
  },
  methods: {
    onSubmit() {
      const modal = this.$refs.modal as any

      modal.openModal()
    },
    closeModal() {
      const modal = this.$refs.modal as any

      modal.closeModal()
    },
  },
})

export default loginPage
