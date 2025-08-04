import { FormGroup } from './form-group'
import { FormControls, FormGroups, FormInterface } from './types'

export class Form implements FormInterface {
  formControls: FormControls = {}
  valid = true
  formGroups: FormGroups = {}

  constructor(formControls: FormControls) {
    Object.entries(formControls).forEach(([name, control]) => {
      control.form = this

      Reflect.defineProperty(this, name, {
        get() {
          return control
        },
      })

      if (control instanceof FormGroup) {
        this.formGroups[name] = control

        Object.entries(control.formControls).forEach(
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
