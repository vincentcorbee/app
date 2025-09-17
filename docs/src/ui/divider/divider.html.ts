export default /* html */ `
<li
  *if="inList"
  role="separator"
  class="ui-divider ui-divider-list"
  *bind:class="['ui-divider--orientation-' + orientation, 'ui-divider--variant-' + variant]"
></li>
<div
  *else
  role="separator"
  class="ui-divider"
  *bind:class="['ui-divider--orientation-' + orientation, 'ui-divider--variant-' + variant]"
></div>
`
