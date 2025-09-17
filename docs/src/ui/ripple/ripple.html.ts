export default /* html */ `
<span
  class="ui-ripple ui-sys-state-layer"
  *bind:class="{
    'ui-ripple--is-active': animationActive,
    'ui-ripple--is-deactive': animationDeactive
  }"
  *bind:style="center ?
    { '--ui-ripple-dimension': rippleDim }
     : {
      '--ui-ripple-dimension': rippleDim,
      '--ui-ripple-scale': rippleScale,
      '--ui-ripple-x': pos.x + 'px',
      '--ui-ripple-y': pos.y + 'px'
      }"
  *ref="ripple"
  @mouseDown="onMouseDown"
  @animationEnd="onAnimationEnd"
  @animationStart="onAnimationStart"
  @click="onClick"
>
  <slot></slot>
</span>
`;
