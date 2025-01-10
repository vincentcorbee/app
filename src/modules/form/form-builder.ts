import { Form } from './form'
import { FormControl } from './form-control'
import { FormGroup } from './form-group'
import { FormControls, FormGroupInterface, FormGroups, Validators } from './types'

export class FormBuilder {
  static form = (
    formControlsConfig: Record<
      string,
      [value: any, validators?: Validators] | FormGroupInterface
    >
  ) => {
    const formControls = Object.entries(formControlsConfig).reduce(
      (acc, [name, controlOrGroup]) => {
        acc[name] = Array.isArray(controlOrGroup)
          ? new FormControl({ value: controlOrGroup[0], validators: controlOrGroup[1] })
          : controlOrGroup

        return acc
      },
      {} as FormControls | FormGroups
    )

    return new Form(formControls)
  }
  static group = (
    formControlsConfig: Record<string, [value: any, validators: Validators]>,
    validators: Validators = {}
  ) => {
    const formControls = Object.entries(formControlsConfig).reduce(
      (acc, [name, [value, validators]]) => {
        acc[name] = new FormControl({ value, validators })

        return acc
      },
      {} as FormControls
    )

    return new FormGroup(formControls, validators)
  }

  static control = (value = null, validators: Validators = {}) => {
    return new FormControl({ value, validators })
  }
}
