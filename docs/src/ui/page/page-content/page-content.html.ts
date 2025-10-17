export default /* html */ `
<div
  *bind:class="[
    'ui-page-content',
    'ui-page-content--direction-' + direction
  ]"
>
  <slot></slot>
</div>
    `
