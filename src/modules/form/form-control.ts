import { AbstractControl } from './form-control.abstract'
import { FormErrors, Validators } from './types'

export class FormControl extends AbstractControl {
  constructor({
    value = null,
    validators = {},
  }: {
    value?: any
    validators?: Validators
  }) {
    super(validators)

    this.value = value

    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = null

      return acc
    }, {} as FormErrors)
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
