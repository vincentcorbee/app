export default /* css */ `
:host {
  --ui-page-body-padding-top: calc(var(--safe-area-inset-top) + calc(var(--ui-sys-unit) * 0));
  --ui-page-body-padding-bottom: calc(var(--safe-area-inset-bottom) + calc(var(--ui-sys-unit) * 32));
  --ui-page-body-padding-left: calc(var(--safe-area-inset-left) + calc(var(--ui-sys-unit) * 16));
  --ui-page-body-padding-right: calc(var(--safe-area-inset-right) + calc(var(--ui-sys-unit) * 16));
  --ui-page-body-scrollbar-color: var(--ui-sys-color-primary);

  display: block;
  position: relative;
  overflow-y: auto;
  padding-top: var(--ui-page-body-padding-top);
  padding-bottom: var(--ui-page-body-padding-bottom);
  padding-left: var(--ui-page-body-padding-left);
  padding-right: var(--ui-page-body-padding-right);
  width: 100%;
  height: 100%;
  perspective: 1px;
  perspective-origin: 0 0;
  overflow-x: hidden;
  scrollbar-color: hsl(var(--ui-page-body-scrollbar-color)) transparent;
  scrollbar-width: thin;
}

.ui-page-body {

}

ui-page-header {
  & ~ .ui-page-body {
    --ui-page-body-padding-top: calc(var(--ui-page-header-height) + var(--safe-area-inset-top));
  }
}

body.no-scroll {
  .ui-page-body {
    overflow: hidden;
  }
}

.ui-page-body-container {
  transform-style: preserve-3d;
}

@media screen and (max-width: 600px) {
  .has-image {
    --ui-page-body-padding-top: 0;
    --ui-page-body-padding-left: calc(var(--safe-area-inset-left));
    --ui-page-body-padding-right: calc(var(--safe-area-inset-right));
    --ui-page-body-padding-bottom: calc(
      var(--ui-page-header-height) + var(--safe-area-inset-bottom)
    );
  }
}

@media screen and (min-width: 1073px) {
  .ui-page-body {
    --ui-page-body-padding-bottom: calc(
      calc(var(--ui-sys-unit) * 8) + var(--safe-area-inset-bottom)
    );
  }
}

@media screen and (display-mode: standalone) {
  .ui-page-body {
    height: 100vh;
    width: 100vw;
  }
}
`
