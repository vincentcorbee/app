import { Directive } from '../../modules'
import {
  EnvironmentRecordInterface,
  EnvironmentVariable,
  EnvironmentVariables,
} from '../types'
import setObservable from './set-observable'

export class EnvironmentRecord implements EnvironmentRecordInterface {
  outer: EnvironmentRecord | null

  #variables: EnvironmentVariables

  constructor(
    outer: EnvironmentRecord | null = null,
    variables: Record<string, EnvironmentVariable> = {}
  ) {
    this.outer = outer
    this.#variables = new Map(Object.entries(variables))
  }

  get this() {
    return this.#variables.get('this')?.value
  }

  createImmutableBinding(name: string, value: any): void {
    if (this.#variables.has(name)) {
      throw SyntaxError(`Identifier ${name} has already been declared`)
    }

    this.#variables.set(name, { mutable: false, value })
  }

  createMutableBinding(name: string, value: any): void {
    if (this.#variables.has(name)) {
      throw SyntaxError(`Identifier ${name} has already been declared`)
    }

    this.#variables.set(name, { mutable: true, value })
  }

  deleteBinding(name: string): boolean {
    return this.#variables.delete(name)
  }
  /* We do one lookup to outer in case of a for directive */
  get(name: string, directive?: Directive | null): any {
    if (!this.#variables.has(name)) {
      if (this.#variables.get('this')?.value !== undefined) {
        if (Reflect.has(this.#variables.get('this')!.value, name)) {
          if (directive) setObservable(name, this, directive)
          return this.#variables.get('this')!.value[name]
        } else if (this.outer) {
          return this.outer.get(name, directive)
        } else {
          return undefined
        }
      }

      if (this.outer) return this.outer.get(name)

      throw ReferenceError(`ReferenceError: ${name} is not defined`)
    }

    return this.#variables.get(name)?.value
  }

  set(name: string, value: any): void {
    const variable = this.#variables.get(name)

    if (!variable) {
      if (this.outer) return this.outer.set(name, value)

      throw ReferenceError(`ReferenceError: "${name}" is not defined`)
    }

    if (!variable.mutable) {
      throw TypeError(`TypeError: Assignment to constant variable: "${name}"`)
    }

    this.#variables.set(name, { ...variable, value })
  }
}
