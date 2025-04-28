import { Store } from './store'
import { ActionsOptions, MutationsOptions, StoreConfig } from './types'

export const createStore = <
  S,
  M extends MutationsOptions<S>,
  A extends ActionsOptions<S>
>(
  config: StoreConfig<S, M, A>
) => new Store<S, M, A>(config)
