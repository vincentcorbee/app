export default /*html*/ `
<button
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  @click="onClick"
>
  <ui-ripple></ui-ripple>
  <slot></slot>
</button>`;
