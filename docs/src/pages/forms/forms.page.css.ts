export default /* css */ `
syntax-highlighting {
  margin: calc(var(--ui-sys-unit) * 32) 0;

  & + ui-divider {
    margin-top: 0;
  }
}

ui-divider {
  margin: calc(var(--ui-sys-unit) * 32) 0;
}

code {
  padding: 2px 4px;
  border-radius: 4px;
  background-color: hsl(var(--ui-sys-color-surface-bright));
  color: hsl(var(--ui-sys-color-primary));
}

.smiley {
  font-size: 24px;
}
`
