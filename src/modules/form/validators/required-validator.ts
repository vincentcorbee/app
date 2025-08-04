import { AbstractControl } from '../form-control.abstract'
import { ValidatorFunctionType } from '../types'

export const requiredValidator: ValidatorFunctionType = (control: AbstractControl) =>
  control.value
    ? null
    : {
        required: true,
      }
