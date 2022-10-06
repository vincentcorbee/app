export class FormControl {
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

export class Form {
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
