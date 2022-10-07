export type ValidatorFunctionType = (input: any) => boolean
export interface ValidatorsInterface {
  [key: string]: ValidatorFunctionType
}
export interface FormErrorsInterface {
  [key: string]: boolean
}

interface FormControlsInterface {
  [key: string]: FormControl
}

interface FormGroupsInterface {
  [key: string]: FormGroup
}

class AbstractControl {
  validators: ValidatorsInterface
  errors: FormErrorsInterface
  value: any | null = null
  form: Form | null = null
  parent?: FormGroup | null = null
  formControls?: FormControlsInterface
  valid = true

  constructor(validators: ValidatorsInterface) {
    this.validators = validators
    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = false

      return acc
    }, {} as FormErrorsInterface)
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
}

export class FormControl extends AbstractControl {
  constructor({
    value = null,
    validators,
  }: {
    value?: any
    validators: ValidatorsInterface
  }) {
    super(validators)

    this.value = value

    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = false

      return acc
    }, {} as FormErrorsInterface)
  }

  validate() {
    const { validators } = this

    if (validators) {
      Object.entries(validators).forEach(
        ([name, fn]) => (this.errors[name] = !fn(this.value))
      )

      this.valid = Object.values(this.errors).every(error => !error)
    } else {
      this.valid = true
    }

    return this.valid
  }
}

export class FormGroup extends AbstractControl {
  formControls: FormControlsInterface

  constructor(
    formControls: FormControlsInterface = {},
    validators: ValidatorsInterface = {}
  ) {
    super(validators)

    this.formControls = formControls
    this.validators = validators
    this.errors = Object.keys(validators).reduce((acc, name) => {
      acc[name] = false

      return acc
    }, {} as FormErrorsInterface)

    Object.values(formControls).forEach(control => (control.parent = this))
  }

  validate() {
    const { validators } = this

    if (validators) {
      const states = Object.values(this.formControls).map(formControl =>
        formControl.validate()
      )

      this.valid = states.every(Boolean)

      if (this.valid) {
        Object.entries(validators).forEach(
          ([name, fn]) => (this.errors[name] = !fn(this))
        )

        this.valid = Object.values(this.errors).every(error => !error)
      }
    } else {
      this.valid = true
    }

    return this.valid
  }
}

export class Form {
  formControls: FormControlsInterface | FormGroupsInterface = {}
  valid = true
  formGroups: FormGroupsInterface = {}

  constructor(formControls: FormControlsInterface | FormGroupsInterface = {}) {
    Object.entries(formControls).forEach(([name, control]) => {
      control.form = this

      if (control.formControls) {
        this.formGroups[name] = control as FormGroup

        Object.entries(control.formControls as FormControlsInterface).forEach(
          ([name, control]) => (this.formControls[name] = control)
        )
      } else {
        this.formControls[name] = control
      }
    })
  }

  validate() {
    const states: boolean[] = []

    Object.values(this.formControls).forEach(
      formControl => !formControl.parent && states.push(formControl.validate())
    )

    Object.values(this.formGroups).forEach(formGroup => states.push(formGroup.validate()))

    this.valid = states.every(Boolean)

    return this.valid
  }
}
