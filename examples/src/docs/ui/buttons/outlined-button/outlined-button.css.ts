export default /* css */ `
:host {
  --ui-outlined-button-container-color: var(--ui-sys-color-surface);
  --ui-outlined-button-container-shape: var(--ui-sys-shape-corner-small);
  --ui-outlined-button-container-height: calc(var(--ui-sys-unit) * 40);
  --ui-outlined-button-container-padding-left: calc(var(--ui-sys-unit) * 24);
  --ui-outlined-button-container-padding-right: calc(var(--ui-sys-unit) * 24);
  --ui-outlined-button-container-padding-top: 0;
  --ui-outlined-button-container-padding-bottom: 0;
  --ui-outlined-button-container-opacity: 0;

  --ui-outlined-button-outline-color: var(--ui-sys-color-primary);
  --ui-outlined-button-outline-opacity: 1;
  --ui-outlined-button-outline-disabled-color: var(--ui-sys-color-on-surface);
  --ui-outlined-button-outline-disabled-opacity: 0.12;
  --ui-outlined-button-outline-width: calc(var(--ui-sys-unit) * 1);

  --ui-outlined-button-label-font: var(--ui-sys-typescale-label-large-font-family-name);
  --ui-outlined-button-label-color: var(--ui-sys-color-primary);
  --ui-outlined-button-label-size: var(--ui-sys-typescale-label-large-font-size);
  --ui-outlined-button-label-weight: var(--ui-sys-typescale-label-large-font-weight);
  --ui-outlined-button-label-line-height: var(
    --ui-sys-typescale-label-large-line-height
  );
  --ui-outlined-button-label-tracking: var(
    --ui-sys-typescale-label-large-letter-spacing
  );
  --ui-outlined-button-label-opacity: 1;

  display: inline-flex;
  height: var(--ui-filled-button-container-height);
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: none;
  height: var(--ui-outlined-button-container-height);
  padding:
    var(--ui-outlined-button-container-padding-top)
    var(--ui-outlined-button-container-padding-right)
    var(--ui-outlined-button-container-padding-bottom)
    var(--ui-outlined-button-container-padding-left);
  cursor: pointer;
  border-radius: var(--ui-outlined-button-container-shape);
  color: hsl(var(--ui-outlined-button-label-color), var(--ui-outlined-button-label-opacity));
  background-color: hsl(var(--ui-outlined-button-container-color), var(--ui-outlined-button-container-opacity));
  font-family: var(--ui-outlined-button-label-font);
  font-size: var(--ui-outlined-button-label-size);
  font-weight: var(--ui-outlined-button-label-weight);
  line-height: var(--ui-outlined-button-label-line-height);
  position: relative;
  border: var(--ui-outlined-button-outline-width) solid hsl(var(--ui-outlined-button-outline-color), var(--ui-outlined-button-outline-opacity));
}

ui-ripple {
  --ui-ripple-pressed-color: var(--ui-sys-color-primary);
  --ui-ripple-hover-color: var(--ui-sys-color-primary);
}
`;
