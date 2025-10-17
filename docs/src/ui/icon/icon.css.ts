export default /* css */ `
:host {
  --ui-icon-size: calc(var(--ui-sys-unit) * 24);
  --ui-icon-color: var(--ui-sys-color-primary);
  --ui-icon-opacity: 1;
  --ui-icon-fill: 1;

  width: var(--ui-icon-size);
  height: var(--ui-icon-size);
  overflow: hidden;
  display: block;
}

.loading {
  visibility: hidden;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;

  font-variation-settings:
  'FILL' var(--ui-icon-fill),
  'wght' 400,
  'GRAD' 0,
  'opsz' 24;

  color: hsl(var(--ui-icon-color), var(--ui-icon-opacity));
  font-size: var(--ui-icon-size);
  height: 100%;
  width: 100%;
}

.material-symbols-outlined {
}

:host([fill="0"]) {
  --ui-icon-fill: 0;
}
`
