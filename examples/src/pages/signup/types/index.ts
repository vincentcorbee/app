import Router from '@App/modules/Router'

export interface AppConfig {
  el?: string
  data?: any
  router?: Router
  components?: any
  methods?: {
    [key: string]: (this: { [key: string]: any }, args?: any) => void
  }
  listeners?: {
    [key: string]: (this: { [key: string]: any }) => void
  }
}
