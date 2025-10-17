export default /* html */ `
<a
  *bind:href="to"
  *ref="link"
  @click="handleOnClick"
  tabindex="-1"
>
  <slot></slot>
</a>
`
