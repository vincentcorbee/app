import {
  MethodsOptions,
  ListnersOptions,
  ComputedOptions,
  ComponentConfig,
} from './types'

export function defineComponent<
  D,
  M extends MethodsOptions,
  L extends ListnersOptions,
  C extends ComputedOptions
>(config: ComponentConfig<D, M, L, C>) {
  return config
}
