import { defineComponent } from '@digitalbranch/app'

import template from './main.html'
import css from './main.css'
import {
  ColorSchema,
  SCAFFOLD_SERVICE_TOKEN,
  Viewport,
  VIEWPORT_SERVICE_TOKEN,
} from '../../ui'

const MENU_ITEMS = [
  {
    to: '/',
    icon: 'home_pin',
    label: 'Home',
  },
  {
    to: '/getting-started',
    icon: 'tools_power_drill',
    label: 'Getting started',
  },
  {
    to: '/props',
    icon: 'code',
    label: 'Props',
  },
  {
    to: '/forms',
    icon: 'check_box',
    label: 'Forms',
  },
  {
    to: '/providers',
    icon: 'syringe',
    label: 'Providers',
  },
]

export const main = defineComponent({
  name: 'app-main',
  inject: [SCAFFOLD_SERVICE_TOKEN, VIEWPORT_SERVICE_TOKEN],
  template,
  css,
  data() {
    return {
      menuItems: MENU_ITEMS,
      colorScheme: 'dark',
      colorSchemeIcon: 'light_mode',
      menuIcon: 'menu_open',
      isNavigationDrawerOpen: true,
      navigationDrawerType: 'standard',
      isNavigationRailVisible: false,
    }
  },
  listeners: {
    ready() {
      this.boundHandleColorSchemeChange = this.handleColorSchemeChange.bind(this)
      this.boundHandleViewportChange = this.handleViewportChange.bind(this)
      this.boundHandleCloseNavigationDrawer = this.handleCloseNavigationDrawer.bind(this)

      this.scaffoldService.on('colorScheme', this.boundHandleColorSchemeChange)
      this.viewportService.on('viewport', this.boundHandleViewportChange)

      this.navigationDrawerType =
        this.viewportService?.viewport.name === 'tablet' ||
        this.viewportService?.viewport.name === 'mobile'
          ? 'modal'
          : 'standard'
      this.isNavigationDrawerOpen = this.viewportService?.viewport.name === 'desktop'
      this.isNavigationRailVisible = this.viewportService?.viewport.name === 'tablet'
      this.menuIcon = this.isNavigationDrawerOpen ? 'menu_open' : 'menu'

      this.$router?.on('navigate', this.boundHandleCloseNavigationDrawer)
    },
    disconnected() {
      this.scaffoldService.off('colorScheme', this.boundHandleColorSchemeChange)
      this.viewportService.off('viewport', this.boundHandleViewportChange)
      this.$router?.off('navigate', this.boundHandleCloseNavigationDrawer)
    },
  },
  methods: {
    handleColorSchemeChange(colorScheme: ColorSchema) {
      this.colorSchemeIcon = `${colorScheme}_mode`
    },
    onChangeColorScheme() {
      const { colorScheme } = this.scaffoldService
      const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark'

      this.scaffoldService.colorScheme = newColorScheme
    },
    handleToggleNavigationDrawer() {
      const isOpen = !this.isNavigationDrawerOpen

      this.menuIcon = isOpen ? 'menu_open' : 'menu'
      this.isNavigationDrawerOpen = isOpen
    },
    handleCloseNavigationDrawer() {
      if (this.navigationDrawerType !== 'modal') return

      this.menuIcon = 'menu'

      this.isNavigationDrawerOpen = false
    },
    handleViewportChange(viewport: Viewport) {
      this.navigationDrawerType =
        viewport.name === 'tablet' || viewport.name === 'mobile' ? 'modal' : 'standard'

      this.handleToggleNavigationDrawer()

      this.isNavigationRailVisible = viewport.name === 'tablet'
    },
  },
})
