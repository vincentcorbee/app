export default /* css */ `
:host {
  --ui-page-header-color: hsl(var(--ui-sys-color-surface));
  --ui-page-header-container-height: calc(var(--ui-sys-unit) * 64 + var(--safe-area-inset-top));
  --ui-page-header-height: calc(var(--ui-sys-unit) * 64 + var(--safe-area-inset-top));
  --ui-page-header-container-padding-top: 0;
  --ui-page-header-container-padding-right: calc(var(--ui-sys-unit) * 48 + var(--safe-area-inset-right));
  --ui-page-header-container-padding-bottom: 0;
  --ui-page-header-container-padding-left: calc(var(--ui-sys-unit) * 48 + var(--safe-area-inset-right));

  --ui-page-header-tabs-padding-top: 0;
  --ui-page-header-tabs-padding-right: calc(var(--ui-sys-unit) * 48 + var(--safe-area-inset-right));
  --ui-page-header-tabs-padding-bottom: 0;
  --ui-page-header-tabs-padding-left: calc(var(--ui-sys-unit) * 48 + var(--safe-area-inset-right));
}

.ui-page-header {
  display: flex;
  flex-direction: column;
  height: var(--ui-page-header-height);
  background-color: hsl(var(--ui-sys-color-surface));

  & ~ .ui-page-body {
    --ui-page-header-height: calc(
      var(--ui-sys-unit) * 64 + var(--safe-area-inset-top)
    );
  }

  &.ui-page-header--has-tabs {
    --ui-page-header-height: calc(
      var(--ui-sys-unit) * 64 * 2 + var(--safe-area-inset-top)
    );
    & ~ .ui-page-body {
      --ui-page-header-height: calc(
        var(--ui-sys-unit) * 64 * 2 + var(--safe-area-inset-top)
      );
    }
  }
}

.ui-page-header {
  display: flex;
  position: absolute;
  justify-content: center;
  z-index: 2;
  width: 100%;
  left: 0;
}

.ui-app-header + .ui-page,
.ui-app-header + .ui-page-transition__container .ui-page {
  .ui-page-header {
    top: var(--app-header--height);
  }
}

.ui-page-header__container {
  height: var(--ui-page-header-container-height);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  padding: 0 var(--ui-page-header-container-padding-right) 0
    var(--ui-page-header-container-padding-left);
}

.ui-page-header__tabs {
  padding: 0 var(--ui-page-header-tabs-padding-right) 0
    var(--ui-page-header-tabs-padding-left);
}

@media screen and (max-width: 600px) {
  .ui-page-header {
    position: fixed;
    width: 100%;
    padding-top: var(--safe-area-inset-top);
  }

  :host {
    --ui-page-header-container-padding-right: calc(var(--ui-sys-unit) * 8 + var(--safe-area-inset-right));
    --ui-page-header-container-padding-left: calc(var(--ui-sys-unit) * 8 + var(--safe-area-inset-right));

    --ui-page-header-tabs-padding-right: calc(var(--ui-sys-unit) * 8 + var(--safe-area-inset-right));
    --ui-page-header-tabs-padding-left: calc(var(--ui-sys-unit) * 8 + var(--safe-area-inset-right));
  }
}

@media screen and (max-width: 1072px) {
  :host {
    --ui-page-header-container-padding-right: calc(var(--ui-sys-unit) * 24 + var(--safe-area-inset-right));
    --ui-page-header-container-padding-left: calc(var(--ui-sys-unit) * 24 + var(--safe-area-inset-right));

    --ui-page-header-tabs-padding-right: calc(var(--ui-sys-unit) * 24 + var(--safe-area-inset-right));
    --ui-page-header-tabs-padding-left: calc(var(--ui-sys-unit) * 24 + var(--safe-area-inset-right));
  }
}
`
