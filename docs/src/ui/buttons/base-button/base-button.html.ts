export default /*html*/ `
<ui-focus-ring *bind:visible="hasFocus ? '' : null"></ui-focus-ring>

<router-link
  class="ui-button"
  *if="to"
  *bind:to="to"
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  *bind:class="buttonClasses"
  *ref="button"
  @click="handleClick"
  @slotchange="handleSlotChange"
>
  <slot name="ripple"></slot>

  <div class="ui-button-content">
    <span class="ui-button-content__start-icon">
      <slot name="icon-start" />
    </span>

    <div class="ui-button-content__body">
      <slot></slot>
    </div>

    <span class="ui-button-content__end-icon">
      <slot name="icon-end"></slot>
    </span>
  </div>
</router-link>
<button
  class="ui-button"
  *else
  *bind:class="buttonClasses"
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  *ref="button"
  @click="handleClick"
  @slotchange="handleSlotChange"
  tabindex="-1"
>
  <slot name="ripple"></slot>

  <div class="ui-button-content">
    <span class="ui-button-content__start-icon">
      <slot name="icon-start"></slot>
    </span>

    <div class="ui-button-content__body">
      <slot></slot>
    </div>

    <span class="ui-button-content__end-icon">
      <slot name="icon-end"></slot>
    </span>
  </div>
</button>
`
