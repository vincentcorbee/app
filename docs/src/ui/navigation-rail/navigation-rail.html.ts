export default /* html */ `
<nav class="ui-navigation-rail">
  <div class="ui-navigation-rail__container">
    <div class="ui-navigation-rail__top-buttons">
      <div class="ui-navigation-rail__menu-button">
        <slot name="menu-button"></slot>
      </div>
      <div class="ui-navigation-rail__fab">
        <slot name="fab"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
  <slot name="divider"></slot>
</nav>`
