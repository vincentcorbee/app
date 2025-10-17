export default /* html */ `
<div
  class="ui-card ui-sys-elevation-layer"
  *bind:class="[
    'ui-card--variant-' + variant,
    'ui-sys-elevation-layer'
  ]"
>
  <div className="ui-card__container">
    <slot></slot>
  </div>
</div>`
