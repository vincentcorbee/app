export default /* html */ `
<ui-scaffold>
  <ui-top-app-bar-small slot="top-app-bar">
    <span slot="headline">ScaffoldJS</span>
    <ui-icon-button
      slot="leading-icon"
      @click="onClick"
    >
      <ui-icon icon="menu"></ui-icon>
    </ui-icon-button>
    <ui-icon-button
      slot="trailing-icon"
      @click="onChangeColorScheme"
    >
      <ui-icon *bind:icon="colorSchemeIcon"></ui-icon>
    </ui-icon-button>
  </ui-top-app-bar-small>

  <ui-navigation-drawer slot="navigation-drawer" open>
    <ui-navigation-drawer-button to="/">
      <ui-icon slot="icon" icon="home_pin"></ui-icon>
      Home
    </ui-navigation-drawer-button>
    <ui-navigation-drawer-button to="/getting-started">
      <ui-icon slot="icon" icon="tools_power_drill"></ui-icon>
      Getting started
    </ui-navigation-drawer-button>
    <ui-navigation-drawer-button to="/props">
      <ui-icon slot="icon" icon="code"></ui-icon>
      Props
    </ui-navigation-drawer-button>
    <ui-navigation-drawer-button to="/forms">
      <ui-icon slot="icon" icon="check_box"></ui-icon>
      Forms
    </ui-navigation-drawer-button>
    <ui-navigation-drawer-button to="/providers">
      <ui-icon slot="icon" icon="syringe"></ui-icon>
      Providers
    </ui-navigation-drawer-button>
  </ui-navigation-drawer>

  <router-view></router-view>
</ui-scaffold>
`
