export default /* css */ `
.ui-scaffold {
  --ui-scaffold-app-background: hsl(var(--ui-sys-color-surface));
  --ui-scaffold-padding-top: 0;

  width: 100%;
  height: 100%;
  display: flex;
  background-color: hsl(var(--ui-scaffold-app-background));
  overflow: hidden;

  .ui-scaffold__content {
    flex: 1;
    overflow: hidden;
  }

  .ui-scaffold__fab {
    position: fixed;
    bottom: calc(var(--ui-sys-unit) * 16);
    right: calc(var(--ui-sys-unit) * 16);
    z-index: 3;
  }

  &.ui-scaffold--has-top-app-bar-small {
    --ui-scaffold-padding-top: var(--ui-top-app-bar-small-height);
  }

  &.ui-scaffold--has-top-app-bar-medium {
    --ui-scaffold-padding-top: var(--ui-top-app-bar-medium-height);
  }

  &.ui-scaffold--has-top-app-bar-medium,
  &.ui-scaffold--has-top-app-bar-small {
    .ui-scaffold__navigation-rail {
      padding-top: var(--ui-scaffold-padding-top);
    }
    .ui-scaffold__navigation-drawer {
      padding-top: var(--ui-scaffold-padding-top);
    }
    .ui-scaffold__content {
      padding-top: var(--ui-scaffold-padding-top);
    }
  }
}

@media screen and (max-width: 600px) {
  .ui-scaffold {
    .ui-scaffold__fab {
      bottom: calc(
        var(--ui-sys-unit) * 16 + var(--safe-area-inset-bottom) +
          var(--ui-navigation-bar-container-height)
      );
    }
  }
}`
