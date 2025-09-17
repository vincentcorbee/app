export default /* css */ `
:host {
  --ui-page-container-padding-top: calc(var(--ui-sys-unit) * 0);
  --ui-page-container-pading-bottom: calc(var(--ui-sys-unit) * 0);

  display: block;
  height: 100%;
}

.ui-page {
  height: 100%;
}

.ui-page-container {
  height: 100%;
  position: relative;
  padding-top: var(--ui-page-container-padding-top);
  padding-bottom: var(--ui-page-container-padding-bottom);
}

@media (display-mode: standalone) {
  .ui-page,
  .ui-page-container {
    height: 100vh;
    width: 100vw;
  }
}`
