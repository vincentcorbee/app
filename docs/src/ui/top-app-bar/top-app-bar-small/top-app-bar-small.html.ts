export default /* html */ `
<div class="ui-top-app-bar-small">
  <div class="ui-top-app-bar-small__container">
    <div class="ui-top-app-bar-small__leading-icon">
      <slot name="leading-icon"/>
    </div>
    <div class="ui-top-app-bar-small__headline">
      <slot name="headline"/>
    </div>
    <div class="ui-top-app-bar-small__trailing-icons">
      <slot name="trailing-icon"/>
    </div>
  </div>
  <slot name="divider"/>
</div>
`
