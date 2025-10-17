export default /* html */ `
<ui-scaffold>
  <ui-top-app-bar-small slot="top-app-bar">
    <span slot="headline">ScaffoldJS</span>
    <ui-icon-button
      *if="!isNavigationRailVisible"
      slot="leading-icon"
      @click="handleToggleNavigationDrawer"
    >
      <ui-icon *bind:icon="menuIcon"></ui-icon>
    </ui-icon-button>
    <ui-icon-button
      slot="trailing-icon"
      @click="onChangeColorScheme"
    >
      <ui-icon *bind:icon="colorSchemeIcon"></ui-icon>
    </ui-icon-button>
  </ui-top-app-bar-small>

  <ui-navigation-drawer
    slot="navigation-drawer"
    @close.custom="handleToggleNavigationDrawer"
    *bind:open="isNavigationDrawerOpen"
    *bind:type="navigationDrawerType"
  >
    <ui-template *if="isNavigationDrawerOpen || navigationDrawerType === 'modal'">
      <ui-navigation-drawer-button
        *for="item of menuItems"
        *bind:to="item.to"
      >
        <ui-icon slot="icon" *bind:icon="item.icon"></ui-icon>
        {{ item.label }}
      </ui-navigation-drawer-button>
    </ui-template>

    <ui-template *else>
      <ui-navigation-rail-button
        *for="item of menuItems"
        *bind:to="item.to"
      >
        <ui-icon slot="icon" *bind:icon="item.icon"></ui-icon>
      </ui-navigation-rail-button>
    </ui-template>
  </ui-navigation-drawer>

  <ui-navigation-rail slot="navigation-rail" *if="isNavigationRailVisible">
    <ui-icon-button icon="menu" slot="menu-button" @click="handleToggleNavigationDrawer">
      <ui-icon icon="menu"></ui-icon>
    </ui-icon-button>
  </ui-navigation-rail>

  <router-view></router-view>
</ui-scaffold>
`
