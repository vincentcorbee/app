export default /* css */ `
:host {
  --page-content-padding-left: var(--ui-page-content-padding-left, calc(var(--ui-sys-unit) * 48));
  --page-content-padding-right: var(--ui-page-content-padding-right, calc(var(--ui-sys-unit) * 48));
  --page-content-padding-top: var(--ui-page-content-padding-top, calc(var(--ui-sys-unit) * 16));
  --page-content-padding-bottom: var(--ui-page-content-padding-bottom, calc(var(--ui-sys-unit) * 16));
}

.ui-page-content {
  flex: 1 1;
  display: flex;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;

  padding-left: var(--page-content-padding-left);
  padding-right: var(--page-content-padding-right);
  padding-top: var(--page-content-padding-top);
  padding-bottom: var(--page-content-padding-bottom);

  scrollbar-color: hsl(var(--ui-sys-color-primary)) transparent;
  scrollbar-width: thin;

  &.ui-page-content--direction-column {
    flex-direction: column;
  }
}

@media screen and (max-width: 1072px) {
  :host {
    --page-content-padding-left: var(--ui-page-content-padding-left, calc(var(--ui-sys-unit) * 24));
    --page-content-padding-right: var(--ui-page-content-padding-left, calc(var(--ui-sys-unit) * 24));
  }
}

@media screen and (max-width: 600px) {
  :host {
    --page-content-padding-left: var(--ui-page-content-padding-left, calc(var(--ui-sys-unit) * 16));
    --page-content-padding-right: var(--ui-page-content-padding-left, calc(var(--ui-sys-unit) * 16));
  }
}`
