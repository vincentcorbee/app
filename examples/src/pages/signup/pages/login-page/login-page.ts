import { Form, FormControl, requiredValidator } from '@App'

interface AppConfig {
  el?: string
  data: any
  methods?: {
    [key: string]: (this: { [key: string]: any }, args?: any) => void
  }
  listeners?: {
    [key: string]: (this: { [key: string]: any }) => void
  }
}

interface Config extends AppConfig {
  data: () => {}
}

const validators = {
  required: requiredValidator,
}

const loginPage = {
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
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" adds html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './login-page.template.html').then(
    ({ default: template }) => template
  ),
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
} as Config

export default loginPage
