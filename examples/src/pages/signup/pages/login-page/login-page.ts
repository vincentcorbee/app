import { Form, FormControl, defineComponent, requiredValidator } from '@digitalbranch/app'

import template from './login-page.template'

const validators = {
  required: requiredValidator,
}

const loginPage = defineComponent({
  name: 'loginPage',
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
  template,
  listeners: {
    ready() {},
  },
  methods: {
    onSubmit() {
      this.$refs.modal.openModal()
    },
    closeModal() {
      this.$refs.modal.closeModal()
    },
  },
})

export default loginPage
