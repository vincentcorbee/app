export type StoreInstance<S, M, A> = S &
  M &
  A & {
    state: S
  }

export type MutationsOptions<S = unknown> = {
  [key: string]: (state: S, payload?: any) => void
}

export type StoreContext<S = unknown> = {
  commit: (action: string, payload?: any) => void
  dispatch: (action: string, payload?: any) => void
  state: S
}

export type ActionsOptions<S = unknown> = {
  [key: string]: (context: StoreContext<S>, payload?: any) => void
}

export type StoreConfig<S, M extends MutationsOptions<S>, A extends ActionsOptions<S>> = {
  state: () => S
  mutations?: M
  actions?: A
} & ThisType<StoreInstance<S, M, A>>

export interface StoreInterface<
  S,
  M extends MutationsOptions<S>,
  A extends ActionsOptions<S>
> {
  state: S
  mutations: M
  actions: A

  commit(action: string, payload?: any): void
  dispatch(action: string, payload?: any): void
}
