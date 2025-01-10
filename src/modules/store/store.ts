import { ActionsOptions, MutationsOptions, StoreConfig, StoreInterface } from './types'

export class Store<S, M extends MutationsOptions<S>, A extends ActionsOptions<S>>
  implements StoreInterface<S, M, A>
{
  state: S
  mutations: M
  actions: A

  constructor(config: StoreConfig<S, M, A>) {
    this.state = config.state()
    this.mutations = config.mutations || ({} as M)
    this.actions = config.actions || ({} as A)
  }

  commit(action: string, payload?: any) {
    if (!Reflect.has(this.mutations, action)) throw Error(`Mutation ${action} not found`)

    this.mutations[action](this.state, payload)

    // console.log('COMMIT', action, payload)
  }

  dispatch(action: string, payload?: any) {
    if (!Reflect.has(this.actions, action)) throw Error(`Action ${action} not found`)

    this.actions[action](
      {
        commit: this.commit.bind(this),
        dispatch: this.dispatch.bind(this),
        state: this.state,
      },
      payload
    )

    // console.log('DISPATCH', action, payload)
  }
}
