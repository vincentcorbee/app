export type ValidatorFunctionType<
  Control extends AbstractControlInterface = AbstractControlInterface
> = (control: Control) => ValidationErrors | null

export interface FormInterface {
  formControls: Record<string, AbstractControlInterface>
  valid: boolean
  formGroups: FormGroups

  validate(): boolean
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

  validate(): boolean
  get(name: string): AbstractControlInterface | null
}

export interface FormGroupInterface extends AbstractControlInterface {
  formControls: FormControls
  errors: FormErrors
  valid: boolean
  validators: Validators

  validate(): boolean
}

export type FormControlOptions = {
  value?: any
  validators?: Validators
}

export interface FormControlInterface extends AbstractControlInterface {
  validate: () => boolean
  setValue(value: any): void
}

export type Validators<
  Control extends AbstractControlInterface = AbstractControlInterface
> = {
  [key: string]: ValidatorFunctionType<Control>
}

export type FormErrors = {
  [key: string]: null | ValidationErrors
}

export type FormControls = {
  [key: string]: AbstractControlInterface
}

export type FormGroups = {
  [key: string]: FormGroupInterface
}
