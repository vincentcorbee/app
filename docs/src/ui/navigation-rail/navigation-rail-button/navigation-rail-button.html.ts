export default /* html */ `
<ui-base-button
  class="ui-navigation-rail-button"
  *bind:to="to"
  *bind:href="href"
  *bind:ripple="false"
  *bind:class="buttonClasses"
  @click="handleClick"
  *ref="buttonRef"
  @slotchange="onSlotChange"
  @routerlinkactive.custom="onRouterLinkActive"
>
  <div class="ui-navigation-rail-button__container">
    <div
      class="ui-navigation-rail-button__content"
      *bind:class="{
        'ui-navigation-rail-button__content--icon-placement-top': hasIcon
      }"
    >
      <span class="ui-navigation-rail-button__icon">
        <slot name="icon"></slot>
      </span>

      <span class="ui-navigation-rail-button__text">
        <slot></slot>
      </span>

    </div>
  </div>
</ui-base-button>
`
