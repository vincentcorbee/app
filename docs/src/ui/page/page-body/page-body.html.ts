export default /* html */ `
<ui-grid
  @scroll="handleOnScroll"
  container
  item
  xs
  class="ui-page-body"
  *bind:class="[
    image && 'has-image'
  ]"
>
  <ui-grid
    item
    container
    xs
    *bind:direction="direction"
    class="ui-page-body-container"
    flex-wrap="nowrap"
  >
    <slot name="image"></slot>
    <slot></slot>
  </ui-grid>
</ui-grid>
`
