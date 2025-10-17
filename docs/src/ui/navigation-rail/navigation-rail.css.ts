export default /* css */ `
:host {
  --ui-navigation-rail-padding-top: calc(var(--safe-area-inset-top) + var(--ui-sys-unit) * 16);
  --ui-navigation-rail-container-color: hsl(var(--ui-sys-color-surface));
  --ui-navigation-rail-container-width: calc(var(--ui-sys-unit) * 80);

  --ui-navigation-rail-container-height: 100%;
  --ui-navigation-rail-button-spacing: calc(var(--ui-sys-unit) * 12);
  --ui-navigation-rail-color: hsl(var(--ui-sys-color-surface));

  --ui-navigation-rail-surface-color: hsl(var(--ui-sys-color-surface-tint), var(--ui-sys-elevation-level0-opacity));
  --ui-navigation-rail-top-buttons-margin-bottom: calc(var(--ui-sys-unit) * 48);
  --ui-navigation-rail-top-buttons-min-height: calc(var(--ui-sys-unit) * 64);
}

.ui-navigation-rail {
  display: flex;
  height: var(--ui-navigation-rail-container-height);

  .ui-navigation-rail__container {
    height: var(--ui-navigation-rail-container-height);
    min-width: var(--ui-navigation-rail-container-width);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    background-color: var(--ui-navigation-rail-container-color);
    padding-left: var(--safe-area-inset-left);
    padding-top: var(--ui-navigation-rail-padding-top);
  }

  .ui-navigation-rail__top-buttons {
    margin-bottom: var(--ui-navigation-rail-top-buttons-margin-bottom);

    .ui-fab {
      &.ui-sys-elevation-layer:after {
        --ui-sys-elevation-layer-shadow: var(--ui-sys-elevation-level0-shadow);
      }
    }

    .ui-navigation-rail__menu-button {
      display: flex;
      justify-content: center;

      &:not(:last-child):not(:empty) {
        margin-bottom: var(--ui-navigation-rail-button-spacing);
      }
    }
  }
}
`
