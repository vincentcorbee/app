import { FormGroup } from './form-group'
import { FormControls, FormGroups } from './types'

export class Form {
  formControls: FormControls | FormGroups = {}
  valid = true
  formGroups: FormGroups = {}

  constructor(formControls: FormControls | FormGroups = {}) {
    Object.entries(formControls).forEach(([name, control]) => {
      control.form = this

      Reflect.defineProperty(this, name, {
        get() {
          return control
        },
      })

      if (control.formControls) {
        this.formGroups[name] = control as FormGroup

        Object.entries(control.formControls as FormControls).forEach(
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
