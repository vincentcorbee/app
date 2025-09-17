export default /* css */ `
:host {
  --ui-top-app-bar-medium-height: calc(var(--ui-sys-unit) * 112);
  --ui-top-app-bar-medium-color: var(--ui-sys-color-surface);
  --ui-top-app-bar-medium-container-padding-left: calc(var(--ui-sys-unit) * 16);
  --ui-top-app-bar-medium-container-padding-right: calc(var(--ui-sys-unit) * 16);

  --ui-top-app-bar-medium-headline-font: var(--ui-sys-typescale-headline-small-font-family-name);
  --ui-top-app-bar-medium-headline-size: var(--ui-sys-typescale-headline-small-font-size);
  --ui-top-app-bar-medium-headline-weight: var(--ui-sys-typescale-headline-small-font-weight);
  --ui-top-app-bar-medium-headline-line-height: var(--ui-sys-typescale-headline-small-line-height);
  --ui-top-app-bar-medium-headline-color: var(--ui-sys-color-on-surface);

  --ui-top-app-bar-medium-leading-icon-color: var(--ui-sys-color-on-surface);
  --ui-top-app-bar-medium-trailing-icon-color: var(--ui-sys-color-on-surface);
}

.ui-top-app-bar-medium {
  height: var(--ui-top-app-bar-medium-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;

  .ui-top-app-bar-medium__container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    background-color: hsl(var(--ui-top-app-bar-medium-color));
    padding-left: var(--ui-top-app-bar-medium-container-padding-left);
    padding-right: var(--ui-top-app-bar-medium-container-padding-right);
    z-index: 4;
  }

  .ui-top-app-bar-medium__leading-icon {
    .ui-button {
      --ui-button-label-color: var(--ui-top-app-bar-medium-leading-icon-color);
    }

    .ui-icon--color-primary {
      --ui-icon-color: var(--ui-top-app-bar-medium-leading-icon-color);
    }

    &:not(:empty) {
      margin-right: calc(var(--ui-sys-unit) * 4);
    }
  }

  .ui-top-app-bar-medium__trailing-icons {
    display: flex;

    .ui-button {
      --ui-button-label-color: var(--ui-top-app-bar-medium-leading-icon-color);
    }

    .ui-icon--color-primary {
      --ui-icon-color: var(--ui-top-app-bar-medium-leading-icon-color);
    }
  }

  .ui-top-app-bar-medium__headline {
    display: flex;
    align-items: center;
    width: 100%;
    font-family: var(--ui-top-app-bar-medium-headline-font);
    font-size: var(--ui-top-app-bar-medium-headline-size);
    line-height: var(--ui-top-app-bar-medium-headline-line-height);
    font-weight: var(--ui-top-app-bar-medium-headline-weight);
    color: hsl(var(--ui-top-app-bar-medium-headline-color));
    margin: 0;
  }
}`
