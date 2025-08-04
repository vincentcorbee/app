import {
  AbstractControlInterface,
  FormControls,
  FormErrors,
  FormGroupInterface,
  FormInterface,
  Validators,
} from './types'

export class AbstractControl implements AbstractControlInterface {
  validators: Validators
  errors: FormErrors
  value: any | null = null
  form: FormInterface | null = null
  parent?: FormGroupInterface | null = null
  formControls?: FormControls
  valid = true

  constructor(validators: Validators) {
    this.validators = validators
    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = null

      return acc
    }, {} as FormErrors)
  }

  get(name: string): AbstractControl | null {
    if (!this.formControls) return null

    const path = name.split('.')

    let [currentPath] = path
    let i = 0
    let controller: AbstractControl | null = this as AbstractControl

    while (controller && currentPath) {
      controller = this.formControls[currentPath] ?? null

      currentPath = path[i++]
    }

    return controller
  }

  validate(): boolean {
    throw Error('Method "validate" not implemented')
  }
}
