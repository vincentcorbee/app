import {
  EnvironmentRecordInterface,
  EnvironmentVariable,
  EnvironmentVariables,
} from '../types'

export class EnvironmentRecord implements EnvironmentRecordInterface {
  private variables: EnvironmentVariables

  constructor(
    public outer: EnvironmentRecord | null = null,
    variables: Record<string, EnvironmentVariable> = {}
  ) {
    this.variables = new Map(Object.entries(variables))
  }

  get this() {
    return this.variables.get('this')?.value
  }

  createImmutableBinding(name: string, value: any): void {
    if (this.variables.has(name))
      throw SyntaxError(`Identifier ${name} has already been declared`)

    this.variables.set(name, { mutable: false, value })
  }

  createMutableBinding(name: string, value: any): void {
    if (this.variables.has(name))
      throw SyntaxError(`Identifier ${name} has already been declared`)

    this.variables.set(name, { mutable: true, value })
  }

  deleteBinding(name: string): boolean {
    return this.variables.delete(name)
  }

  get(name: string): any {
    if (!this.variables.has(name)) {
      if (this.variables.has('this') && this.variables.get('this')?.value !== undefined)
        return this.variables.get('this')!.value[name]
      if (this.outer) return this.outer.get(name)

      throw ReferenceError(`ReferenceError: ${name} is not defined`)
    }

    return this.variables.get(name)?.value
  }

  set(name: string, value: any): void {
    const variable = this.variables.get(name)

    if (!variable) {
      if (this.outer) return this.outer.set(name, value)

      throw ReferenceError(`ReferenceError: "${name}" is not defined`)
    }

    if (!variable.mutable)
      throw TypeError(`TypeError: Assignment to constant variable: "${name}"`)

    this.variables.set(name, { ...variable, value })
  }
}
