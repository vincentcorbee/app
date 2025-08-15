export default /* css */ `
:root {
  --ui-top-app-bar-small-height: calc(var(--ui-sys-unit) * 64);
}

:host {
  display: block;
}

.ui-top-app-bar-small {
  --ui-top-app-bar-small-color: var(--ui-sys-color-surface);
  --ui-top-app-bar-small-container-padding-left: calc(var(--ui-sys-unit) * 16);
  --ui-top-app-bar-small-container-padding-right: calc(var(--ui-sys-unit) * 16);

  --ui-top-app-bar-small-headline-font: var(
    --ui-sys-typescale-title-large-font-family-name
  );
  --ui-top-app-bar-small-headline-size: var(
    --ui-sys-typescale-title-large-font-size
  );
  --ui-top-app-bar-small-headline-weight: var(
    --ui-sys-typescale-title-large-font-weight
  );
  --ui-top-app-bar-small-headline-line-height: var(
    --ui-sys-typescale-title-large-line-height
  );
  --ui-top-app-bar-small-headline-color: var(--ui-sys-color-on-surface);

  --ui-top-app-bar-small-leading-icon-color: var(--ui-sys-color-on-surface);

  --ui-top-app-bar-small-trailing-icon-color: var(--ui-sys-color-on-surface);
}

.ui-top-app-bar-small {
  height: var(--ui-top-app-bar-small-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;

  .ui-top-app-bar-small__container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    background-color: hsl(var(--ui-top-app-bar-small-color));
    padding-left: var(--ui-top-app-bar-small-container-padding-left);
    padding-right: var(--ui-top-app-bar-small-container-padding-right);
    z-index: 4;
  }

  .ui-top-app-bar-small__leading-icon {
    .ui-button {
      --ui-button-label-color: var(--ui-top-app-bar-small-leading-icon-color);
    }

    .ui-icon--color-primary {
      --ui-icon-color: var(--ui-top-app-bar-small-leading-icon-color);
    }

    &:not(:empty) {
      margin-right: calc(var(--ui-sys-unit) * 4);
    }
  }

  .ui-top-app-bar-small__trailing-icons {
    display: flex;

    .ui-button {
      --ui-button-label-color: var(--ui-top-app-bar-small-leading-icon-color);
    }

    .ui-icon--color-primary {
      --ui-icon-color: var(--ui-top-app-bar-small-leading-icon-color);
    }
  }

  .ui-top-app-bar-small__headline {
    display: flex;
    align-items: center;
    flex: 1;
    font-family: var(--ui-top-app-bar-small-headline-font);
    font-size: var(--ui-top-app-bar-small-headline-size);
    line-height: var(--ui-top-app-bar-small-headline-line-height);
    font-weight: var(--ui-top-app-bar-small-headline-weight);
    color: hsl(var(--ui-top-app-bar-small-headline-color));
    margin: 0;
  }
}`
