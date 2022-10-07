import { Form, FormControl, requiredValidator, FormGroup } from '@App'
import { User } from '../../models'
import { AppConfig } from '../../types'

import './signup-page.css'

interface AppData {
  title: string
  user: User
  newUser: null | User
}

interface Config extends AppConfig {
  data(): AppData
}

const validators = {
  required: requiredValidator,
}

const signupPage = {
  name: 'signupPage',
  data() {
    return {
      title: 'Signup',
      user: new User(),
      newUser: null,
      passwordControl: '',
      genders: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      signup: new Form({
        firstname: new FormControl({ value: '', validators }),
        lastname: new FormControl({ value: '', validators }),
        gender: new FormControl({ value: '', validators }),
        age: new FormControl({ value: '', validators }),
        passwords: new FormGroup(
          {
            password: new FormControl({ value: '', validators }),
            passwordControl: new FormControl({ value: '', validators }),
          },
          {
            passwordMatch: (input: FormGroup) => {
              const password = input.get('password')?.value
              const passwordControl = input.get('passwordControl')?.value

              return password === passwordControl ? true : false
            },
          }
        ),
      }),
    }
  },
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" adds html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './signup-page.template.html').then(
    ({ default: template }) => template
  ),
  listeners: {
    ready() {},
  },
  methods: {
    onSubmit() {
      this.newUser = this.user
      this.user = new User()
      this.passwordControl = ''

      this.$refs.modal.openModal()
    },
    closeModal() {
      this.$refs.modal.closeModal()
    },
  },
} as Config

export default signupPage
