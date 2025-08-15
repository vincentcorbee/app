export default /* html */ `
<ui-scaffold>
  <ui-top-app-bar-small slot="top-app-bar">
    <span slot="headline">App.js</span>
    <ui-icon-button
      slot="leading-icon"
      @click="onClick"
    >
      <ui-icon icon="menu"></ui-icon>
    </ui-icon-button>
    <ui-icon-button
      slot="trailing-icon"
      @click="onClick"
    >
      <ui-icon icon="light_mode"></ui-icon>
    </ui-icon-button>
  </ui-top-app-bar-small>
</ui-scaffold>
`
