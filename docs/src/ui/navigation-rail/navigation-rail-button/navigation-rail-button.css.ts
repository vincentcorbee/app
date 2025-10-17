export default /* css */ `
:host {
  --ui-navigation-rail-button-text-size: var(--ui-sys-typescale-label-medium-font-size);
  --ui-navigation-rail-label-tracking: var(--ui-sys-typescale-label-medium-tracking);
  --ui-navigation-rail-button-text-line-height: var(--ui-sys-typescale-label-medium-line-height);
  --ui-navigation-rail-button-text-inactive-color: var(--ui-sys-color-on-surface-variant);
  --ui-navigation-rail-button-text-active-color: var(--ui-sys-color-on-surface);
  --ui-navigation-rail-button-text-weight: var(--ui-sys-typescale-label-medium-font-weight);
  --ui-navigation-rail-button-active-indicator-color: var(--ui-sys-color-secondary-container);
  --ui-navigation-rail-button-icon-inactive-color: var(--ui-sys-color-on-surface-variant);
  --ui-navigation-rail-button-icon-active-color: var(--ui-sys-color-on-secondary-container);

  --ui-navigation-rail-button-state-layer-color: var(--ui-sys-color-on-surface-variant);
  --ui-navigation-rail-button-state-layer-opacity: 0;
  --ui-navigation-rail-button-height: calc(var(--ui-sys-unit) * 56);
  --ui-navigation-rail-button-spacing: calc(var(--ui-sys-unit) * 12);
}

.ui-navigation-rail-button {
  display: flex;
  height: var(--ui-navigation-rail-button-height);
  flex: 1;
  color: hsl(var(--ui-navigation-rail-button-text-inactive-color));
  max-height: var(--ui-navigation-rail-button-height);

  ::slotted(ui-icon) {
    --ui-icon-color: var(--ui-navigation-rail-button-icon-inactive-color);

    z-index: 0;
  }

  ui-ripple {
    --ui-sys-elevation-layer-shadow: var(--ui-sys-elevation-level0-shadow);
  }

  &.ui-navigation-rail-button--has-label {
    &:not(:last-child) {
      margin-bottom: var(--ui-navigation-rail-button-spacing);
    }

    .ui-navigation-rail-button__icon {
      margin-bottom: 4px;
    }
  }

  &:hover {

      --ui-navigation-rail-button-state-layer-opacity: var(--ui-sys-state-hover-state-layer-opacity);


    ui-ripple {
      --ui-sys-state-layer-opacity: 0;
    }
  }

  &:hover,
  &.ui-navigation-rail-button--is-active {
    --ui-navigation-rail-button-text-weight: var(--ui-sys-typescale-label-medium-font-weight-prominent);

    color: hsl(var(--ui-navigation-rail-button-text-active-color));

    .ui-navigation-rail-button__icon::before {
      transform: scale(1, 1);
      opacity: 1;
    }

    ::slotted(ui-icon) {
      --ui-icon-color: var(--ui-navigation-rail-button-icon-active-color);
    }

    &.ui-sys-elevation-layer:after {
      --ui-sys-elevation-layer-shadow: var(--ui-sys-elevation-level0-shadow);
    }
  }

  .ui-navigation-rail-button__icon {
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      border-radius: 16px;
      opacity: 0;
      top: 0;
      z-index: 0;
      display: block;
      position: absolute;
      transform: scale(0, 1);
      transition: 0.15s ease-out;
      pointer-events: none;
      background-color: hsl(var(--ui-navigation-rail-button-active-indicator-color));
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
      opacity: var(--ui-navigation-rail-button-state-layer-opacity);
      border-radius: 16px;
      background-color: hsl(var(--ui-navigation-rail-button-state-layer-color));
      transition: 0.15s ease-out;
    }
  }

  &:focus,
  &:focus-within,
  &:hover {
    box-shadow: none;
  }
}

.ui-navigation-rail-button__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
}

.ui-navigation-rail-button__content {
  padding-top: var(--ui-navigation-rail-button-padding-top);
  padding-bottom: var(--ui-navigation-rail-button-padding-bottom);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-navigation-rail-button__content--icon-placement-top {
  flex-direction: column;
}

.ui-navigation-rail-button .ui-navigation-rail-button__text {
  font-size: var(--ui-navigation-rail-button-text-size);
  line-height: var(--ui-navigation-rail-button-text-line-height);
  letter-spacing: var(--ui-navigation-rail-label-tracking);
  white-space: nowrap;
  font-weight: var(--ui-navigation-rail-button-text-weight);
}

.ui-navigation-rail-button__container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
}
`
