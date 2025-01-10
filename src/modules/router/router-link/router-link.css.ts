export default /* css */ `
:host {
  --router-link-link-color: hsl(var(--ui-sys-color-priamry))
  --router-link-link-font-weight: 400;
  --router-link-link-decoration: none;
}

a {
  color: hsl(var(--router-link-link-color));
  text-decoration: var(--router-link-link-decoration);
  font-weight: var(--router-link-link-font-weight);
}
`
