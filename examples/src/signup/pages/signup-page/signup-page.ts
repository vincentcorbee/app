import {
  Form,
  FormControl,
  requiredValidator,
  FormGroup,
  defineComponent,
} from '@digitalbranch/app'
import { User } from '../../models'

import template from './signup-page.html'
import css from './signup-page.css'

export type SignupPageState = {
  title: string
  user: User
  newUser: User | null
  passwordControl: string
  genders: { label: string; value: string }[]
  signup: Form
}

const validators = {
  required: requiredValidator,
}

const signupPage = defineComponent({
  name: 'signupPage',
  data(): SignupPageState {
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
            passwordMatch: input => {
              const password = input.get('password')?.value
              const passwordControl = input.get('passwordControl')?.value

              if (password === passwordControl) return null

              return { passwordMatch: true }
            },
          }
        ),
      }),
    }
  },
  template,
  css,
  methods: {
    onSubmit() {
      this.newUser = this.user
      this.user = new User()
      this.passwordControl = ''
      ;(this.$refs.modal as any).openModal()
    },
    closeModal() {
      ;(this.$refs.modal as any).closeModal()
    },
  },
})

export default signupPage
