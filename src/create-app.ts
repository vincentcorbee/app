import App from './modules/app'

import {
  MethodsOptions,
  ListnersOptions,
  ComputedOptions,
  ComponentConfig,
} from './types'

export function createApp<
  D,
  M extends MethodsOptions,
  L extends ListnersOptions,
  C extends ComputedOptions
>(config: ComponentConfig<D, M, L, C>) {
  return new App({ ...config })
}
