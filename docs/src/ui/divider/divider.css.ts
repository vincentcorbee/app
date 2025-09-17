export default /* css */ `
:host {
  display: block;
}

.ui-divider {
  --ui-divider-color: var(--ui-sys-color-outline-variant);
  --ui-divider-inset-left: 0;
  --ui-divider-inset-right: 0;
  --ui-divider-inset-top: 0;
  --ui-divider-inset-bottom: 0;
  --ui-divider-border-width: calc(var(--ui-sys-unit) * 1);

  margin: 0;

  &.ui-divider--orientation-horizontal {
    border-top-color: hsl(var(--ui-divider-color));
    border-top-width: var(--ui-divider-border-width);
    border-top-style: solid;
    margin: 0;
    margin-top: var(--ui-divider-inset-top);
    margin-bottom: var(--ui-divider-inset-bottom);
    margin-left: var(--ui-divider-inset-left);
    margin-right: var(--ui-divider-inset-right);
  }

  &.ui-divider--orientation-vertical {
    border-top-width: 0;
    border-left-width: var(--ui-divider-border-width);
    border-left-color: hsl(var(--ui-divider-color));
    border-left-style: solid;
    border-right-width: 0;
    border-right-color: var(--ui-divider-color);
    border-right-style: solid;
    border-bottom-width: 0;
    height: 100%;
  }

  &.ui-divider--variant-inset {
    --ui-divider-inset-left: calc(var(--ui-sys-unit) * 16);
    --ui-divider-inset-right: calc(var(--ui-sys-unit) * 16);
  }
}
`
