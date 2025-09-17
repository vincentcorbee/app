export default /* html */ `
<ui-base-button
  class="ui-navigation-drawer-button"
  *bind:class="[
    hasLabel && 'ui-navigation-drawer-button--has-label',
    hasIcon && 'ui-navigation-drawer-button--has-icon',
    active && 'ui-navigation-drawer-button--active'
  ]"
  *bind:to="to"
  *bind:to="href"
  @click="handleClick"
  @slotchange="onSlotChange"
  @routerlinkactive.custom="onRouterLinkActive"
>
  <slot name="icon" slot="icon-start"></slot>

  <div class="ui-navigation-drawer-button__container">
    <div
      class="ui-navigation-drawer-button__content"
      *bind:class="{ 'ui-navigation-drawer-button__content--icon-placement-left': hasIcon }"
    >
      <span class="ui-navigation-drawer-button__text">
        <slot></slot>
      </span>
    </div>
  </div>
</ui-base-button>`
