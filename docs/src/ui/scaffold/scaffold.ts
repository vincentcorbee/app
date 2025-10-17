import { defineComponent } from '@digitalbranch/app'

import template from './scaffold.html'
import css from './scaffold.css'

export type SafeAreaCSSVariables =
  | '--safe-area-inset-top'
  | '--safe-area-inset-bottom'
  | '--safe-area-inset-left'
  | '--safe-area-inset-right'

export type ScreenOrientation =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary'

export type ViewportName = 'mobile' | 'tablet' | 'desktop'

export type DisplayMode = 'browser' | 'standalone'

export type SafeArea = {
  top: number
  left: number
  bottom: number
  right: number
}

export type Viewport = {
  name: ViewportName
  min: number
  max: number
  orientation: ScreenOrientation
  displayMode: DisplayMode
  safeArea: SafeArea
}

const ViewPortSizes: Viewport[] = [
  {
    name: 'mobile',
    min: 0,
    max: 600,
    orientation: 'landscape-primary',
    displayMode: 'browser',
    safeArea: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
  {
    name: 'tablet',
    min: 601,
    max: 1072,
    orientation: 'landscape-primary',
    displayMode: 'browser',
    safeArea: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
  {
    name: 'desktop',
    min: 1073,
    max: Infinity,
    orientation: 'landscape-primary',
    displayMode: 'browser',
    safeArea: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
]

const getComputedValue = (
  computedStyles: CSSStyleDeclaration,
  property: SafeAreaCSSVariables
) => parseInt(computedStyles.getPropertyValue(property).replace('px', ''), 10) || 0

const getViewPort = (width: number) => {
  const viewport =
    ViewPortSizes.find(({ min, max }) => width >= min && width <= max) || null

  if (viewport) {
    viewport.displayMode = getDisplayMode()
    viewport.safeArea = getSafeArea(viewport.displayMode)

    if (screen.orientation) viewport.orientation = screen.orientation.type
  }

  return viewport
}

const getDisplayMode = (): DisplayMode =>
  window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'

const getSafeArea = (displayMode: DisplayMode) => {
  if (displayMode === 'standalone') {
    const computedStyles = getComputedStyle(document.documentElement)

    return {
      top: getComputedValue(computedStyles, '--safe-area-inset-top'),
      left: getComputedValue(computedStyles, '--safe-area-inset-left'),
      bottom: getComputedValue(computedStyles, '--safe-area-inset-bottom'),
      right: getComputedValue(computedStyles, '--safe-area-inset-right'),
    }
  }

  return {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
}

export type ColorSchema = 'light' | 'dark'

export type ThemeSettings = {
  colorScheme: ColorSchema
}

type ScaffoldData = {
  hasTopAppBar: boolean
  darkModePreference: MediaQueryList | null
}

const LOCAL_STORAGE_THEME_KEY = 'ui-material-design-theme-settings'

export const SCAFFOLD_SERVICE_TOKEN = 'scaffoldService'

export const VIEWPORT_SERVICE_TOKEN = 'viewportService'

export class ScaffoldService {
  #themeSettings: ThemeSettings
  #handlers: { colorScheme: Array<(colorScheme: ColorSchema) => void> }

  constructor() {
    this.#themeSettings = { colorScheme: 'dark' }
    this.#handlers = { colorScheme: [] }
  }

  get colorScheme() {
    return this.#themeSettings.colorScheme
  }

  set colorScheme(colorScheme: ColorSchema) {
    this.#setThemeSettings({ colorScheme })

    this.#handlers.colorScheme.forEach(handler => handler(colorScheme))
  }

  get themeSettings() {
    return { ...this.#themeSettings }
  }

  set themeSettings(themeSettings: ThemeSettings) {
    this.#setThemeSettings(themeSettings)
  }

  on(event: 'colorScheme', handler: () => void) {
    this.#handlers[event].push(handler)
  }

  off(event: 'colorScheme', handler: () => void) {
    const handlers = this.#handlers[event]

    this.#handlers[event] = handlers.filter(currentHandler => currentHandler !== handler)
  }

  #setThemeSettings(themeSettings: ThemeSettings) {
    const newThemeSettings = { ...this.#themeSettings, ...themeSettings }

    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(newThemeSettings))

    this.#themeSettings = newThemeSettings
  }
}

export class ViewportService {
  #viewport: Viewport | null
  #handlers: { viewport: Array<(viewport: Viewport) => void> }

  constructor() {
    this.#viewport = getViewPort(window.innerWidth)
    this.#handlers = { viewport: [] }

    window.addEventListener('resize', this.#handleResize)

    if (screen.orientation) {
      screen.orientation.addEventListener('change', this.#handleResize)
    }
  }

  set viewport(viewport: Viewport | null) {
    const currentViewport = this.#viewport

    if (currentViewport?.name === viewport?.name) return

    this.#viewport = viewport

    if (this.#viewport) this.#notify('viewport', this.#viewport)
  }

  get viewport(): Viewport | null {
    return this.#viewport
  }

  on(event: 'viewport', cb: (viewport: Viewport) => void) {
    this.#handlers[event].push(cb)
  }

  off(event: 'viewport', cb: (viewport: Viewport) => void) {
    const handlers = this.#handlers[event]

    this.#handlers[event] = handlers.filter(handler => handler !== cb)
  }

  destroy() {
    window.removeEventListener('resize', this.#handleResize)
  }

  #notify(event: 'viewport', payload: Viewport) {
    this.#handlers[event].forEach(cb => cb(payload))
  }

  #handleResize = () => {
    this.viewport = getViewPort(window.innerWidth)
  }
}

export const uiScaffold = defineComponent({
  name: 'ui-scaffold',
  inject: [SCAFFOLD_SERVICE_TOKEN],
  template,
  css,
  data(): ScaffoldData {
    return {
      hasTopAppBar: false,
      darkModePreference: null,
    }
  },
  listeners: {
    ready() {
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
      const colorScheme = darkModePreference.matches ? 'dark' : 'light'

      this.boundHandleColorSchemeChange = this.handleColorSchemeChange.bind(this)
      this.darkModePreference = darkModePreference

      this.scaffoldService.on('colorScheme', this.boundHandleColorSchemeChange)

      this.boundOnCustomPropertyHeight = this.onCustomPropertyHeight.bind(this)
      this.boundHandleDarkModePreferenceChange =
        this.handleDarkModePreferenceChange.bind(this)

      this.$node.addEventListener(
        'custom-property-height',
        this.boundOnCustomPropertyHeight
      )

      const themeSettings = { colorScheme, ...this.getThemeSettings() }

      this.scaffoldService.themeSettings = themeSettings
      this.scaffoldService.colorScheme = themeSettings.colorScheme
    },
    disconnected() {
      this.darkModePreference?.removeEventListener(
        'change',
        this.boundHandleDarkModePreferenceChange
      )

      this.scaffoldService.off('colorScheme', this.boundHandleColorSchemeChange)

      this.$node.removeEventListener(
        'custom-property-height',
        this.boundOnCustomPropertyHeight
      )
    },
  },
  methods: {
    onSlotChange(e: Event) {
      if (!e.target) return

      const target = e.target as HTMLSlotElement
      const { name } = target
      const hasNodes = target.assignedNodes().length > 0

      if (name === 'top-app-bar') this.hasTopAppBar = hasNodes
    },
    onCustomPropertyHeight(e: CustomEvent<string>) {
      const { detail } = e

      this.$node.shadowRoot?.adoptedStyleSheets[0].insertRule(
        `:host { --ui-top-app-bar-small-height: ${detail}; }`
      )
    },
    getThemeSettings() {
      try {
        const storedSettings =
          localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || '{ "colorScheme": "dark" }'

        return JSON.parse(storedSettings)
      } catch {
        return { colorScheme: 'dark' }
      }
    },
    handleDarkModePreferenceChange() {
      const colorScheme = this.scaffoldService.colorScheme

      this.scaffoldService.colorScheme = colorScheme === 'dark' ? 'light' : 'dark'
    },
    handleColorSchemeChange(colorScheme: ColorSchema) {
      document.documentElement.setAttribute('data-mode', colorScheme)
    },
  },
})
