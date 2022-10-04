import { AppConfig } from '../signup'

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

  fullName() {
    return `${this.firstname} ${this.lastname}`
  }

  constructor(firstname?: string, lastname?: string, gender?: string, age?: number) {
    this.firstname = firstname || this.firstname
    this.lastname = lastname || this.lastname
    this.gender = gender || this.gender
    this.age = age || this.age
    this.details = {
      hobbies: 'none',
    }
  }
}

class FormControl {
  errors: { [key: string]: boolean }
  validators: { [key: string]: (input: any) => boolean }
  value: any | null = null
  form: Form | null = null
  valid = true

  constructor({
    value = null,
    validators,
  }: {
    value?: any
    validators: { [key: string]: (input: any) => boolean }
  }) {
    this.validators = validators
    this.value = value

    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = false

      return acc
    }, {} as { [key: string]: boolean })
  }

  validate() {
    const { validators } = this

    if (validators) {
      for (const [name, fn] of Object.entries(validators)) {
        this.errors[name] = !fn(this.value)
      }

      this.valid = Object.values(this.errors).every(error => !error)
    } else {
      this.valid = true
    }

    return this.valid
  }
}

class Form {
  formControls: { [key: string]: FormControl } = {}
  valid = true

  constructor(formControls: { [key: string]: FormControl }) {
    this.formControls = formControls

    for (const control of Object.values(formControls)) {
      control.form = this
    }
  }

  validate() {
    const states = []

    for (const formControl of Object.values(this.formControls)) {
      states.push(formControl.validate())
    }

    this.valid = states.every(state => state)

    return this.valid
  }
}

const requiredValidator = {
  required: (input: string) => !!input,
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
        firstname: new FormControl({ value: '', validators: requiredValidator }),
        lastname: new FormControl({ value: '', validators: requiredValidator }),
        gender: new FormControl({ value: '', validators: requiredValidator }),
        age: new FormControl({ value: '', validators: requiredValidator }),
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
    ready() {
      console.log(this.signup)
    },
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
