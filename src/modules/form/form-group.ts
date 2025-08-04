import { AbstractControl } from './form-control.abstract'
import { FormControls, FormErrors, FormGroupInterface, Validators } from './types'

export class FormGroup extends AbstractControl implements FormGroupInterface {
  formControls: FormControls

  constructor(formControls: FormControls = {}, validators: Validators = {}) {
    super(validators)

    this.formControls = formControls
    this.validators = validators
    this.errors = Object.keys(validators).reduce<FormErrors>((acc, name) => {
      acc[name] = null

      return acc
    }, {})

    Object.entries(formControls).forEach(([name, control]) => {
      control.parent = this

      if (control.form && !Reflect.has(control.form, name)) {
        Reflect.defineProperty(control.form, name, {
          get() {
            return control
          },
        })
      }
    })
  }

  validate() {
    const { validators } = this

    if (validators) {
      const states = Object.values(this.formControls).map(formControl =>
        formControl.validate()
      )

      this.valid = states.every(Boolean)

      if (this.valid) {
        Object.entries(validators).forEach(([name, fn]) => (this.errors[name] = fn(this)))

        console.log(this.errors)

        this.valid = Object.values(this.errors).every(error => !error)
      }
    } else {
      this.valid = true
    }

    return this.valid
  }
}
