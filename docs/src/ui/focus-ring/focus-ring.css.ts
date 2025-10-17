export default /* css */ `
:host {
  --focus-ring-outline-opacity: 0;
  --focus-ring-outline-disabled-color: var(--ui-sys-color-on-surface);
  --focus-ring-outline-disabled-opacity: 0.12;
  --focus-ring-outline-width: 0;

  --focus-ring-indicator-color: var(--ui-focus-ring-indicator-color, var(--ui-sys-color-secondary));
  --focus-ring-indicator-thickness: var(--ui-focus-ring-indicator-thickness, var(--ui-sys-state-focus-indicator-thickness));
  --focus-ring-outline-offset: var(--ui-focus-ring-outline-offset, var(--ui-sys-state-focus-indicator-outer-offset));

  --focus-ring-shape: var(--ui-focus-ring-shape, var(--ui-sys-shape-corner-small));

  position: absolute;
  display: none;
  pointer-events: none;
  box-sizing: border-box;
  outline: var(--focus-ring-indicator-thickness) solid hsl(var(--focus-ring-indicator-color));
  outline-offset: var(--focus-ring-outline-offset);
  border-radius: var(--focus-ring-shape);
}

:host([visible]) {
  --focus-ring-outline-opacity: 1;

  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
`
