export default /* css */ `
:host {
  --ui-paragraph-font-size: var(--ui-sys-typescale-body-large-font-size);
  --ui-paragraph-line-height: var(--ui-sys-typescale-body-large-line-height);
  --ui-paragraph-font-weight: var(--ui-sys-typescale-body-large-font-weight);
}
p {
  font-size: var(--ui-paragraph-font-size);
  line-height: var(--ui-paragraph-line-height);
  /* letter-spacing: var(--ui-sys-typescale-body-large-letter-spacing); */
  font-weight: var(--ui-paragraph-font-weight);
  margin-top: 0;
}
`
