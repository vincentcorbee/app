export default /* css */ `
:host {
  --page-header-padding-left: calc(var(--ui-sys-unit) * 8);
  --page-header-padding-right: calc(var(--ui-sys-unit) * 8);
  --page-header-padding-bottom: calc(var(--ui-sys-unit) * 8);
}

::slotted(ui-heading) {
  --ui-heading-font-size: calc(var(--ui-sys-typescale-display-large-font-size) * 1.4);
  --ui-heading-line-height: calc(
    var(--ui-sys-typescale-display-large-line-height) * 1.4
  );
  --ui-heading-font-weight: 425;
}

::slotted(ui-paragraph) {
  --ui-paragraph-font-size: var(--ui-sys-typescale-title-large-font-size);
}

.page-header {
  padding-left: var(--page-header-padding-left);
  padding-right: var(--page-header-padding-right);
  max-width: 1760px;

  ui-card {
    width: 100%;
    max-height: 524px;

    &:first-child {
      align-items: center;
      display: flex;
    }

    ui-card-content {
      --ui-card-content-padding-left: calc(var(--ui-sys-unit) * 56);
      --ui-card-content-padding-right: calc(var(--ui-sys-unit) * 56);
      --ui-card-content-padding-top: calc(var(--ui-sys-unit) * 56);
      --ui-card-content-padding-bottom: calc(var(--ui-sys-unit) * 56);
    }
  }

  .page-header__image--align-end {
    .ui-card {
      align-items: flex-end;
    }
  }

  .page-header__image--align-start {
    .ui-card {
      align-items: flex-start;
    }
  }

  .ui-card-image {
    width: 100%;
    height: 100%;

    img {
      object-fit: cover;
      height: 100%;
    }
  }

  .page-header__video {
    video {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}

@media screen and (max-width: 1199px) {
  .page-header {
    .ui-card {
      max-height: 450px;
    }
  }
}

@media screen and (max-width: 600px) {
  ::slotted(ui-heading) {
    --ui-heading-font-size: calc(var(--ui-sys-typescale-display-large-font-size));
    --ui-heading-line-height: calc(var(--ui-sys-typescale-display-large-line-height));
    --ui-heading-font-weight: 425;
  }

  ::slotted(ui-paragraph) {
    --ui-paragraph-font-size: var(--ui-sys-typescale-title-medium-font-size);
  }
  .page-header {
    ui-card {
      ui-card-content {
        --ui-card-content-padding-left: calc(var(--ui-sys-unit) * 24);
        --ui-card-content-padding-right: calc(var(--ui-sys-unit) * 24);
        --ui-card-content-padding-top: calc(var(--ui-sys-unit) * 24);
        --ui-card-content-padding-bottom: calc(var(--ui-sys-unit) * 24);
      }
    }
  }
}`
