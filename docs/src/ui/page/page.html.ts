export default /* html */ `
<ui-grid
  container
  flex-wrap="nowrap"
  class="ui-page"
>

  <ui-grid
    item
    container
    direction="column"
    xs="12"
    sm
    class="ui-page-container"
  >
    <slot></slot>
  </ui-grid>
</ui-grid>
`
