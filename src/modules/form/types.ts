export type ValidatorFunctionType = (
  control: AbstractControlInterface
) => ValidationErrors | null

export interface FormInterface {
  formControls: FormControls | FormGroups
  valid: boolean
  formGroups: FormGroups
  validate: () => boolean
}

export type ValidationErrors = {
  [key: string]: any
}

export interface AbstractControlInterface {
  validators: Validators
  errors: FormErrors
  value: any | null
  form: FormInterface | null
  parent?: FormGroupInterface | null
  formControls?: FormControls
  valid: boolean

  get(name: string): AbstractControlInterface | null
}

export interface FormGroupInterface extends AbstractControlInterface {
  formControls: FormControls
  validators: Validators
  errors: FormErrors
  valid: boolean

  validate(): boolean
}

export interface FormControlInterface extends AbstractControlInterface {
  validate: () => boolean
  setValue(value: any): void
}

export type Validators = {
  [key: string]: ValidatorFunctionType
}

export type FormErrors = {
  [key: string]: null | ValidationErrors
}

export type FormControls = {
  [key: string]: FormControlInterface
}

export type FormGroups = {
  [key: string]: FormGroupInterface
}
