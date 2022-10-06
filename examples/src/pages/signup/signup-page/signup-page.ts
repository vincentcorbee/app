import { AppConfig } from '../signup'
import { Form, FormControl, requiredValidator } from '@App'

import './signup-page.css'

interface AppData {
  title: string
  user: User
  newUser: null | User
}

interface Config extends AppConfig {
  data(): AppData
}

class User {
  firstname = ''
  lastname = ''
  gender = ''
  age: string | number = ''
  details: any
  password = ''

  fullName() {
    return `${this.firstname} ${this.lastname}`
  }

  constructor(
    firstname?: string,
    lastname?: string,
    gender?: string,
    age?: number,
    password?: string
  ) {
    this.firstname = firstname || this.firstname
    this.lastname = lastname || this.lastname
    this.gender = gender || this.gender
    this.age = age || this.age
    this.details = {
      hobbies: 'none',
    }
    this.password = password || this.password
  }
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
      genders: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      signup: new Form({
        firstname: new FormControl({ value: '', validators }),
        lastname: new FormControl({ value: '', validators }),
        gender: new FormControl({ value: '', validators }),
        age: new FormControl({ value: '', validators }),
        password: new FormControl({ value: '', validators }),
      }),
    }
  },
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" addes html to the bundle in stead of a seperate chunk.
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

      this.$refs.modal.openModal()
    },
    closeModal() {
      this.$refs.modal.closeModal()
    },
  },
} as Config

export default signupPage
