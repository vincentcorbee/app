export default /* html */ `
<nav
  *ref="drawer"
  class="ui-navigation-drawer"
  *bind:class="drawerClasses"
  *bind:style="{
    zIndex: zIndex
  }"
>
  <div
    id="ui-navigation-drawer"
    class="ui-navigation-drawer__container"
  >
    <div class="ui-navigation-drawer__body">
      <slot/>
    </div>
    <slot name="divider"/>
  </div>
  <div
    *if="type === 'modal' && open"
    class="ui-navigation-drawer__scrim"
    @click="onClose"
    role="button"
  ></div>
</nav>
`
