export default /* css */ `
:host {
  --router-link-link-color: var(--ui-sys-color-priamry)
  --router-link-link-font-weight: 400;
  --router-link-link-decoration: none;

  --router-link-padding-left: 0;
  --router-link-padding-right: 0;
  --router-link-padding-top: 0;
  --router-link-padding-bottom: 0;
}

a {
  all: inherit;
  color: hsl(var(--router-link-link-color));
  text-decoration: var(--router-link-link-decoration);
  font-weight: var(--router-link-link-font-weight);
  padding:
    var(--router-link-padding-top)
    var(--router-link-padding-right)
    var(--router-link-padding-bottom)
    var(--router-link-padding-left);
}
`
