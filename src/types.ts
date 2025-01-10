import { Encapsulation } from './constants'
import { VNode } from './modules'
import Directive from './modules/directive'
import Emitter from './modules/emitter'
import { StoreInterface } from './modules/store/types'

export type ExtractReturnType<C extends ComputedOptions> = {
  [prop in keyof C]: ReturnType<C[prop]>
}

export type ComponentsOptions = {
  [key: string]: any
}

export type MethodsOptions = {
  [key: string]: Function
}

export declare type ComputedGetter<T> = (...args: any[]) => T

export type ListnersOptions = {
  [key: string]: Function
}

export type ComputedOptions = Record<string, ComputedGetter<any>>

export type ComponentRefs = Record<string, HTMLElement>

export type ComponentInstance<
  D = {},
  M extends MethodsOptions = {},
  L extends ListnersOptions = {},
  C extends ComputedOptions = {}
> = D & M & L & ExtractReturnType<C> & ComponentInterface<D, M, L, C>

export interface ComponentInterface<
  D = {},
  M extends MethodsOptions = {},
  L extends ListnersOptions = {},
  C extends ComputedOptions = {}
> {
  $data: D
  $toBeDestroyed: boolean
  $isDestroyed: boolean
  $isMounted: boolean
  $children: ComponentInstance[]
  $parent: ComponentInstance | null
  $route: any
  $router: Router
  $store: any
  $node: HTMLElement
  $el: any
  $refs: ComponentRefs
  $providers: Record<string, any>
  _data: D
  emit(event: string, ...args: any[]): void
  $emit(event: string, ...args: any[]): void
  $dispatchEvent(event: Event): void
  $dispatchCustomEvent<T>(event: string, eventInitDict?: CustomEventInit<T>): void
  $mount(el?: string | HTMLElement): Promise<ComponentInstance<D, M, L, C>>
  $nextTick(): void
  $getProvider(key: string): any
  $destroy(): void
}

export type ComponentConfig<
  D,
  M extends MethodsOptions,
  L extends ListnersOptions,
  C extends ComputedOptions
> = {
  props?: Props
  el?: string
  name?: string
  router?: Router
  store?: StoreInterface<any, any, any>
  components?: any
  template?: string | Promise<string>
  css?: string | Promise<string>
  encapsulation?: EncapsulationType
  data?: D
  methods?: M
  listeners?: L
  computed?: C
  formAssociated?: boolean
  inject?: string[]
  provide?: Record<string, any>
} & ThisType<ComponentInstance<D, M, L, C>>

export interface RouterInterface {
  get baseUrl(): string
  set baseUrl(path: string)
  get $vm(): any
  set $vm(vm: any)
  set(...args: any[]): void
  navigate(url: string, pushState?: boolean): void
  setQueryParams(params: Record<string, any>): void
  addRoute(route: any): Router
  registerRouterLink(routerLink: any): void
  unRegisterRouterLink(routerLink: any): void
  next(arg?: string | Error | boolean): void
  currentRoute: any
}

type Router = RouterInterface

export type Component = ComponentInterface

export type EncapsulationType = (typeof Encapsulation)[keyof typeof Encapsulation]

export type PropType =
  | 'boolean'
  | 'array'
  | 'string'
  | 'number'
  | 'object'
  | 'array'
  | 'date'
  | 'any'
  | null

export type PropDefinition = {
  name: string
  type: PropType
  required?: boolean
  default?: any
}

export type Props =
  | Array<string | PropDefinition>
  | Record<string, PropType | Omit<PropDefinition, 'name'>>

export type AttributeChanged = {
  name: string
  value: string
  oldValue: string
}

export interface VNodeInterface<T extends Node = Node | Element> extends Emitter {
  id: number
  isDetached: boolean
  isCollected: boolean
  children?: VNodeInterface[]
  toBeRemoved: boolean
  eventListeners?: Record<string, any> | null

  vm: ComponentInstance | null
  parent: VNodeInterface | null
  node: T | null
  directives: Directive[]

  nextSibling: VNodeInterface | null
  previousSibling: VNodeInterface | null

  detach(): void
  removeChild(child: VNodeInterface | number, count?: number): void
  replaceChild(oldChild: VNodeInterface, newChild: VNodeInterface): void
  removeLastChild(): void
  removeFirstChild(): void
  addChild(
    childElement: VNodeInterface,
    index?: number | null,
    parentNode?: Node | null
  ): void
  $destroy(): void
}

export type Update = { type: 'string'; value: any; prop: any; target: any }

export type DirectiveConfig = {
  name: string
  reg: RegExp
  bind: (
    this: Directive,
    vNode: VNode,
    vm: ComponentInstance,
    expressionParser: Function
  ) => void
  update?: (this: Directive, update: Update) => void
}
