export default /* css */ `
:host {
  --card-container-shape: var(--ui-card-container-shape, var(--ui-sys-shape-corner-medium));
}

.ui-card {
  background-color: hsl(var(--ui-card-container-color));
  border-radius: var(--card-container-shape);
  border: var(--ui-card-outline-width, 0) solid
    hsl(var(--ui-card-outline-color, 0, 0, 0, 0));
  position: relative;
  width: inherit;

  &.ui-card--variant-elevated {
    --ui-card-elevation-shadow: var(--ui-sys-elevation-level1-shadow);
    --ui-card-container-color: var(--ui-sys-color-surface-container-low);

    &.ui-card--is-clickable {
      --ui-card-pressed-state-layer-color: var(--ui-sys-color-on-surface);

      &:hover {
        --ui-card-elevation-shadow: var(--ui-sys-elevation-level2-shadow);

        .ui-sys-state-layer:before {
          --ui-card-hover-state-layer-color: var(--ui-sys-color-on-surface);
          --ui-card-hovers-state-layer-opacity: var(
            --ui-sys-state-hover-state-layer-opacity
          );
        }
      }

      &.ui-card--is-pressed {
        --ui-card-elevation-shadow: var(--ui-sys-elevation-level1-shadow);
      }
    }
  }

  &.ui-card--variant-filled {
    --ui-card-container-color: var(--ui-sys-color-surface-container-highest);
    --ui-card-title-color: var(--ui-sys-color-on-surface);
  }

  &.ui-card--variant-outlined {
    --ui-card-container-color: var(--ui-sys-color-surface);
    --ui-card-outline-width: calc(var(--ui-sys-unit) * 1);
    --ui-card-outline-color: var(--ui-sys-color-outline-variant);
  }

  &.ui-sys-elevation-layer:after {
    --ui-sys-elevation-layer-shadow: var(--ui-card-elevation-shadow);
  }

  .ui-sys-state-layer:before {
    --ui-sys-state-layer-color: var(--ui-card-hover-state-layer-color);
    --ui-sys-state-layer-opacity: var(--ui-card-hover-state-layer-opacity);
  }

  &.ui-card--is-clickable {
    cursor: pointer;
  }

  .ui-ripple {
    --ui-ripple-color: var(--ui-card-pressed-state-layer-color);
  }

  .ui-card__container {
    overflow: hidden;
    border-radius: var(--card-container-shape);
    width: 100%;
    height: 100%;
  }
}`
