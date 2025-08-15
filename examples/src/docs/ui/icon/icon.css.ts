export default /* css */ `
:host {
  --ui-icon-size: calc(var(--ui-sys-unit) * 24);
  --ui-icon-color: var(--ui-sys-color-primary);
  --ui-icon-opacity: 1;

  width: var(--ui-icon-size);
  height: var(--ui-icon-size);
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24;

  color: hsl(var(--ui-icon-color), var(--ui-icon-opacity));
  font-size: var(--ui-icon-size);
  height: 100%;
  width: 100%;
}

:host([fill="0"]) {
  --material-symbols--fill: 0;
}
`;
