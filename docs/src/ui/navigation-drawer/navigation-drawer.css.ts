export default /* css */ `
:host {
  --ui-navigation-drawer-container-width: calc(var(--ui-sys-unit) * 360);
  --ui-navigation-drawer-container-height: 100%;
  --ui-navigation-drawer-container-shape: 0;
  --ui-navigation-drawer-container-elevation: var(
    --ui-sys-elevation-level0-shadow
  );
  --ui-navigation-drawer-container-padding-left: calc(
    var(--safe-area-inset-left) + var(--ui-sys-unit) * 10
  );
  --ui-navigation-drawer-container-padding-right: calc(var(--ui-sys-unit) * 10);
  --ui-navigation-drawer-container-padding-top: calc(
    var(--safe-area-inset-top) + var(--ui-sys-unit) * 16
  );
  --ui-navigation-drawer-container-padding-bottom: calc(
    var(--safe-area-inset-bottom) + var(--ui-sys-unit) * 16
  );
  --ui-navigation-drawer-container-background-color: hsl(
    var(--ui-sys-color-surface)
  );
  --ui-navigation-drawer-container-surface-tint-color: hsl(
    var(--ui-sys-color-surface-tint)
  );
  --ui-navigation-drawer-container-elevation: var(
    --ui-sys-elevation-level0-opacity
  );

  view-transition-name: none;
}

::slotted(*) {
  max-width: 100%;
}

.ui-navigation-drawer {
  width: var(--ui-navigation-drawer-container-width);
  height: var(--ui-navigation-drawer-container-height);
}

.ui-divider {
  --ui-divider-inset-top: calc(var(--ui-sys-unit) * 8);
  --ui-divider-inset-bottom: calc(var(--ui-sys-unit) * 8);
  --ui-divider-inset-left: calc(var(--ui-sys-unit) * 16);
  --ui-divider-inset-right: calc(var(--ui-sys-unit) * 16);
}

.ui-navigation-drawer__container {
  width: var(--ui-navigation-drawer-container-width);
  height: var(--ui-navigation-drawer-container-height);
  display: flex;
  overflow: hidden;
  z-index: 2;
  background-color: var(--ui-navigation-drawer-container-background-color);
  border-radius: 0 var(--ui-navigation-drawer-container-shape) var(--ui-navigation-drawer-container-shape) 0;
  overflow: hidden;

  .ui-navigation-drawer__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: var(--ui-navigation-drawer-container-padding-top);
    padding-left: var(--ui-navigation-drawer-container-padding-left);
    padding-right: var(--ui-navigation-drawer-container-padding-right);
    padding-bottom: var(--ui-navigation-drawer-container-padding-bottom);
    overflow-y: auto;
    scrollbar-color: hsl(var(--ui-sys-color-primary)) transparent;
    scrollbar-width: thin;

    .ui-button {
      justify-content: flex-start;
    }
  }

  .ui-navigation-drawer__menu {
    --ui-button-label-color: hsl(var(--ui-sys-color-on-surface-variant));

    margin-left: var(--offset-3);
    margin-bottom: var(--spacing-3);
    margin-top: var(--spacing-1);
    flex: 0;
  }
}

.ui-navigation-drawer__scrim {
  background-color: hsl(var(--ui-sys-color-scrim));
  cursor: pointer;
  z-index: 1;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0s ease 0.3s;
  display: block;
}

.ui-navigation-drawer-modal {
  --ui-navigation-drawer-container-shape: var(--ui-sys-shape-corner-large);

  position: fixed;
  z-index: 2;
  pointer-events: none;

  .ui-navigation-drawer__container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
    transform: translate(-100%, 0);

    > .ui-divider {
      display: none;
    }
  }
}

.ui-navigation-drawer-standard {
  transition: width 0.2s;

  .ui-navigation-drawer__container {
    transition: width 0.2s;
  }
}

.ui-navigation-drawer-standard--is-collapsed {
  --ui-navigation-drawer-container-width: calc(var(--ui-sys-unit) * 77);
  --ui-navigation-drawer-container-padding-left: 0;
  --ui-navigation-drawer-container-padding-right: 0;
  --ui-navigation-drawer-container-padding-top: calc(
    var(--safe-area-inset-top) + var(--ui-sys-unit) * 16
  );

  .ui-navigation-drawer__body {
    align-items: center;
  }
}

.ui-navigation-drawer-modal--is-open {
  pointer-events: initial;

  .ui-navigation-drawer__container {
    transform: translate(0, 0);
    box-shadow: var(--ui-navigation-drawer-container-elevation);
  }

  .ui-navigation-drawer__scrim {
    pointer-events: auto;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }
}
`
