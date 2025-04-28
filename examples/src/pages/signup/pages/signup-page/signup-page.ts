import {
  Form,
  FormControl,
  requiredValidator,
  FormGroup,
  defineComponent,
} from '@digitalbranch/app'
import { User } from '../../models'

import template from './signup-page.template'

const validators = {
  required: requiredValidator,
}

const signupPage = defineComponent({
  name: 'signupPage',
  data() {
    return {
      title: 'Signup',
      user: new User(),
      newUser: null as null | User,
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

              return password === passwordControl
            },
          }
        ),
      }),
    }
  },
  template,
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
})

export default signupPage
