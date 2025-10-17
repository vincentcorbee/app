export default /* html */ `
<ui-base-button
  class="ui-icon-button"
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  *ref="button"
  @click="handleClick"
>
  <ui-ripple slot="ripple"></ui-ripple>

  <slot slot="icon-start"></slot>

</ui-base-button>
`
