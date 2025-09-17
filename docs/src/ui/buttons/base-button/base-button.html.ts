export default /*html*/ `
<router-link
  class="ui-button"
  *if="to"
  *bind:to="to"
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  @click="onClick"
>
  <ui-ripple></ui-ripple>
  <div class="ui-button-content">
    <span class="ui-button-content__start-icon">
      <slot name="icon-start" @slotchange="onSlotChange"/>
    </span>

    <div class="ui-button-content__body"><slot @slotchange="onSlotChange"/></div>

    <span class="ui-button-content__end-icon">
      <slot name="icon-end" @slotchange="onSlotChange"/>
    </span>
  </div>

  <slot></slot>
</router-link>
<button
  class="ui-button"
  *else
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  @click="onClick"
>
  <ui-ripple></ui-ripple>
  <div class="ui-button-content">
    <span class="ui-button-content__start-icon">
      <slot name="icon-start" @slotchange="onSlotChange"/>
    </span>

    <div class="ui-button-content__body"><slot @slotchange="onSlotChange"/></div>

    <span class="ui-button-content__end-icon">
      <slot name="icon-end" @slotchange="onSlotChange"/>
    </span>
  </div>

  <slot></slot>
</button>
`
