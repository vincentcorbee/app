export default /* html */ `
<div class="ui-top-app-bar-medium">
  <div className="ui-top-app-bar-medium__container">
    <div className="ui-top-app-bar-medium__leading-icon">
      <slot name="leading-icon"/>
    </div>
    <div className="ui-top-app-bar-medium__trailing-icons">
      <slot name="trailing-icons"/>
    </div>
    <div className="ui-top-app-bar-medium__headline">
      <slot name="headline"/>
    </div>
  </div>
  <slot name="divider"/>
</div>
`
