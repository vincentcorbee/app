export default /* css */ `
:host {
  --ui-button-container-color: none;
  --ui-button-container-shape: var(--ui-sys-shape-corner-small);
  --ui-button-container-height: calc(var(--ui-sys-unit) * 40);
  --ui-button-container-width: auto;
  --ui-button-container-padding-left: calc(var(--ui-sys-unit) * 24);
  --ui-button-container-padding-right: calc(var(--ui-sys-unit) * 24);
  --ui-button-container-padding-top: 0;
  --ui-button-container-padding-bottom: 0;
  --ui-button-container-opacity: 0;

  --ui-button-outline-color: transparent;
  --ui-button-outline-opacity: 0;
  --ui-button-outline-disabled-color: var(--ui-sys-color-on-surface);
  --ui-button-outline-disabled-opacity: 0.12;
  --ui-button-outline-width: 0;

  --ui-button-label-font: var(--ui-sys-typescale-label-large-font-family-name);
  --ui-button-label-color: var(--ui-sys-color-primary);
  --ui-button-label-size: var(--ui-sys-typescale-label-large-font-size);
  --ui-button-label-weight: var(--ui-sys-typescale-label-large-font-weight);
  --ui-button-label-line-height: var(--ui-sys-typescale-label-large-line-height);
  --ui-button-label-tracking: var(--ui-sys-typescale-label-large-letter-spacing);
  --ui-button-label-opacity: 1;

  --ui-button-icon-left-margin: calc(var(--ui-sys-unit) * 8);
  --ui-button-icon-size: calc(var(--ui-sys-unit) * 18);
  --ui-button-icon-disabled-opacity: 1;
  --ui-button-icon-color: var(--ui-sys-color-primary);
  --ui-button-icon-opacity: 1;
  --ui-button-icon-disabled-color: var(--ui-sys-color-on-surface);

  display: inline-flex;
  width: var(--ui-button-container-width);
  min-width: var(--ui-button-container-width);
  height: var(--ui-button-container-height);
  min-height: var(--ui-button-container-height);
}

::slotted(ui-icon) {
  --ui-icon-color: var(--ui-button-icon-color);
}

.ui-button {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: none;
  padding:
    var(--ui-button-container-padding-top)
    var(--ui-button-container-padding-right)
    var(--ui-button-container-padding-bottom)
    var(--ui-button-container-padding-left);
  cursor: pointer;
  border-radius: var(--ui-button-container-shape);
  color: hsl(var(--ui-button-label-color), var(--ui-button-label-opacity));
  background-color: hsl(var(--ui-button-container-color), var(--ui-button-container-opacity));
  font-family: var(--ui-button-label-font);
  font-size: var(--ui-button-label-size);
  font-weight: var(--ui-button-label-weight);
  line-height: var(--ui-button-label-line-height);
  position: relative;
  border: var(--ui-button-outline-width) solid hsl(var(--ui-button-outline-color), var(--ui-button-outline-opacity));
  width: 100%;
  height: 100%;
  overflow: hidden;
}

router-link.ui-button {
  padding: 0;

  --router-link-padding-top: var(--ui-button-container-padding-top);
  --router-link-padding-right:  var(--ui-button-container-padding-right);
  --router-link-padding-bottom:  var(--ui-button-container-padding-bottom);
  --router-link-padding-left:  var(--ui-button-container-padding-left);

}

.ui-button-content {
  display: flex;
  align-items: center;
  width: 100%;

  > *:not(:first-child) {
    margin-left: var(--ui-button-icon-left-margin);
  }

  .ui-button-content__body {
    display: inherit;
    align-items: inherit;
    width: inherit;
    justify-content: inherit;
  }
}

ui-ripple {
  --ui-ripple-pressed-color: var(--ui-sys-color-primary);
  --ui-ripple-hover-color: var(--ui-sys-color-primary);
}
`
