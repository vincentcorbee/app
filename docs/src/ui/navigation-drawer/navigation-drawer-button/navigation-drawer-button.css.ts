export default /* css */ `
:host {
  --ui-navigation-button-container-color: transparent;
  --ui-navigation-drawer-button-text-color: var(--ui-sys-color-on-surface-variant);
  --ui-navigation-drawer-button-text-weight: var(--ui-sys-typescale-label-large-font-weight);
  --ui-navigation-drawer-button-text-size: var(--ui-sys-typescale-label-large-font-size);
  --ui-navigation-drawer-button-container-shape: calc(var(--ui-sys-unit) * 28);
  --ui-navigation-drawer-button-active-indicator-height: calc(var(--ui-sys-unit) * 56);
  --ui-navigation-drawer-button-active-indicator-padding: calc(var(--ui-sys-unit) * 12);
  --ui-navigation-drawer-button-icon-size: calc(var(--ui-sys-unit) * 24);
  --ui-navigation-drawer-button-inactive-icon-color: var(--ui-sys-color-on-surface-variant);
  --ui-navigation-drawer-button-active-icon-color: var(--ui-sys-color-on-secondary-container);
  --ui-navigation-button-container-opacity: 0;

  display: block;
  width: 100%;
}

ui-base-button {
  --ui-button-container-color: var(--ui-navigation-button-container-color);
  --ui-button-container-shape: var(--ui-navigation-drawer-button-container-shape);
  --ui-button-container-height: var(--ui-navigation-drawer-button-active-indicator-height);
  --ui-button-container-width: 100%;
  --ui-button-container-opacity: var(--ui-navigation-button-container-opacity);

  --ui-button-label-font: var(--ui-sys-typescale-label-large-font-family-name);
  --ui-button-label-color: var(--ui-navigation-drawer-button-text-color);
  --ui-button-label-size: var(--ui-navigation-drawer-button-text-size);
  --ui-button-label-weight: var(--ui-navigation-drawer-button-text-weight);

  --ui-button-icon-color: var(--ui-navigation-drawer-button-active-icon-color);

  &.active,
  &.ui-navigation-drawer-button--active {
    --ui-navigation-drawer-button-text-color: var(--ui-sys-color-on-secondary-container);

    --ui-navigation-button-container-color: var(--ui-sys-color-secondary-container);
    --ui-navigation-button-container-opacity: 1;

    &:hover {
      &.ui-sys-state-layer:before {
        --ui-sys-state-layer-color: var(--ui-sys-color-secondary-container);
      }

      &.ui-sys-elevation-layer:after {
        --ui-sys-elevation-layer-shadow: var(--ui-sys-elevation-level0-shadow);
      }
    }

    .ui-icon {
      --ui-icon-color: var(--ui-navigation-drawer-button-active-icon-color);
    }
  }

  &:hover {
    &.ui-sys-state-layer:before {
      --ui-sys-state-layer-opacity: var(
        --ui-sys-state-hover-state-layer-opacity
      );
      --ui-sys-state-layer-color: var(--ui-sys-color-on-surface);
    }

    &.ui-sys-elevation-layer:after {
      --ui-sys-elevation-layer-shadow: var(--ui-sys-elevation-level0-shadow);
    }
  }

  .ui-navigation-drawer-button__text {
    white-space: nowrap;
  }

  .ui-button-content {
    --ui-button-icon-left-margin: var(
      --ui-navigation-drawer-button-active-indicator-padding
    );

    --ui-button-icon-size: var(--ui-navigation-drawer-button-icon-size);
  }
}
`
