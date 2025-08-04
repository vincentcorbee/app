import { AbstractControl } from './form-control.abstract'
import { FormControlInterface, FormControlOptions, FormErrors } from './types'

export class FormControl extends AbstractControl implements FormControlInterface {
  constructor(options: FormControlOptions) {
    const { value = null, validators = {} } = options

    super(validators)

    this.value = value

    this.errors = Object.keys(validators).reduce<FormErrors>((acc, name) => {
      acc[name] = null

      return acc
    }, {})
  }

  setValue(value: any) {
    this.value = value
  }

  validate(): boolean {
    const { validators } = this

    if (validators) {
      Object.entries(validators).forEach(([name, fn]) => (this.errors[name] = fn(this)))

      this.valid = Object.values(this.errors).every(error => !error)
    } else {
      this.valid = true
    }

    return this.valid
  }
}
