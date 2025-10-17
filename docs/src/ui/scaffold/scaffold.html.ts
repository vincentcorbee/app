export default /* html */ `
<div class="ui-scaffold" *bind:class="{ 'ui-scaffold--has-top-app-bar-small': hasTopAppBar }">
  <div class="ui-scaffold__top-app-bar">
    <slot name="top-app-bar" @slotchange="onSlotChange"></slot>
  </div>

  <div class="ui-scaffold__navigation-drawer">
    <slot name="navigation-drawer"></slot>
  </div>

  <div class="ui-scaffold__navigation-rail">
    <slot name="navigation-rail"></slot>
  </div>

  <div class="ui-scaffold__content">
    <slot></slot>
  </div>
</div>
`
