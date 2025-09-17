export default /* html */ `
<div
  class="ui-page-header"
  *bind:class="[
    hasTabs && 'ui-page-header--has-tabs',
  ]"
>
  <div className="ui-page-header__container"><slot></slot></div>
  <slot name="divider"></slot>
  <div class="ui-page-header__tabs"><slot name="tabs"></slot></div>
</div>
`
