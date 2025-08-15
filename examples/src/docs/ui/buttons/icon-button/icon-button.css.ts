export default /* css */ `
:host {
  --ui-icon-button-icon-size: calc(var(--ui-sys-unit) * 24);
  --ui-icon-button-icon-opacity: 1;
  --ui-icon-button-container-opacity: 1;
  --ui-icon-button-container-height: calc(var(--ui-sys-unit) * 40);
  --ui-icon-button-container-width: calc(var(--ui-sys-unit) * 40);
  --ui-icon-button-container-width: var(--ui-icon-button-container-height);
  --ui-icon-button-container-shape: var(--ui-sys-shape-corner-full);
  --ui-icon-button-outline-width: calc(var(--ui-sys-unit) * 1);
  --ui-icon-button-outline-color: var(--ui-sys-color-outline);
}

::slotted(ui-icon) {
  --ui-icon-color: var(--ui-icon-button-icon-color);
  --ui-icon-opacity: var(--ui-icon-button-icon-opacity);
}

button {
  cursor: pointer;
  border-radius: var(--ui-icon-button-container-shape);
  background-color: hsl(
    var(--ui-icon-button-container-color),
    var(--ui-icon-button-container-opacity)
  );
  border: none;
  font-family: var(--ui-icon-button-label-font);
  padding: 0;
  overflow: hidden;
  transition: 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  z-index: 0;
  width: var(--ui-icon-button-container-width);
  min-width: var(--ui-icon-button-container-width);
  height: var(--ui-icon-button-container-height);
  min-height: var(--ui-icon-button-container-height);

  &:focus,
  &:hover {
    outline: none;
  }

  &.ui-sys-state-layer:before {
    transition-timing-function: cubic-bezier(
      var(--ui-sys-motion-easing-standard)
    );
    transition-duration: var(--ui-sys-motion-duration-short4);
    transition-property: background-color;
  }

  &.ui-icon-button--variant-filled {
    --ui-icon-button-container-color: var(--ui-sys-color-primary);
    --ui-icon-button-icon-color: var(--ui-sys-color-on-primary);
    --ui-ripple-pressed-color: hsl(var(--ui-sys-color-on-primary));

    &:hover {
      &.ui-sys-state-layer:before {
        --ui-sys-state-layer-opacity: var(
          --ui-sys-state-hover-state-layer-opacity
        );
        --ui-sys-state-layer-color: var(--ui-sys-color-on-surface);
      }
    }

    &.ui-icon-button--is-disabled {
      --ui-icon-button-container-color: var(--ui-sys-color-on-surface);
      --ui-icon-button-icon-color: var(--ui-sys-color-on-surface);
    }
  }

  &.ui-icon-button--variant-tonal {
    --ui-icon-button-container-color: var(--ui-sys-color-secondary-container);
    --ui-icon-button-icon-color: var(--ui-sys-color-on-secondary-container);
    --ui-ripple-pressed-color: hsl(var(--ui-sys-color-on-secondary-container));

    &:hover {
      &.ui-sys-state-layer:before {
        --ui-sys-state-layer-opacity: var(
          --ui-sys-state-hover-state-layer-opacity
        );
        --ui-sys-state-layer-color: var(--ui-sys-color-on-secondary-container);
      }
    }

    &.ui-icon-button--is-disabled {
      --ui-icon-button-container-color: var(--ui-sys-color-on-surface);
      --ui-icon-button-icon-color: var(--ui-sys-color-on-surface);
    }
  }

  &.ui-icon-button--variant-outlined {
    --ui-icon-button-icon-color: var(--ui-sys-color-on-surface-variant);
    --ui-ripple-pressed-color: hsl(var(--ui-sys-color-primary));

    border: var(--ui-icon-button-outline-width) solid
      hsla(
        var(--ui-icon-button-outline-color),
        var(--ui-icon-button-container-opacity)
      );

    &:hover {
      &.ui-sys-state-layer:before {
        --ui-sys-state-layer-opacity: var(
          --ui-sys-state-hover-state-layer-opacity
        );
        --ui-sys-state-layer-color: var(--ui-sys-color-primary);
      }
    }

    &.ui-icon-button--is-disabled {
      --ui-icon-button-icon-color: var(--ui-sys-color-on-surface);
      --ui-icon-outline-color: var(--ui-sys-color-on-surface);
    }
  }

  &.ui-icon-button--variant-standard {
    --ui-ripple-pressed-color: hsl(var(--ui-sys-color-primary));
    --ui-icon-button-container-color: transparent;
    --ui-icon-button-icon-color: var(--ui-sys-color-on-surface-variant);

    &:hover {
      &.ui-sys-state-layer:before {
        --ui-sys-state-layer-opacity: var(
          --ui-sys-state-hover-state-layer-opacity
        );
        --ui-sys-state-layer-color: var(--ui-sys-color-on-surface);
      }
    }

    &.ui-icon-button--is-disabled {
      --ui-icon-button-icon-color: var(--ui-sys-color-on-surface);
    }
  }

  &.ui-icon-button--is-disabled {
    --ui-icon-button-container-opacity: 0.12;
    --ui-icon-button-icon-opacity: 0.38;

    cursor: unset;

    &.ui-sys-state-layer:before {
      display: none;
    }
  }

  .ui-icon-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
`
