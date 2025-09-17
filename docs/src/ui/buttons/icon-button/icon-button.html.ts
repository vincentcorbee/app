export default /* html */ `
<button
  class="ui-icon-button ui-sys-state-layer ui-sys-elevation-layer"
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  @click="onClick"
>
  <ui-ripple></ui-ripple>

  <div class="ui-icon-button-content">
    <slot/>
  </div>
</button>
`
