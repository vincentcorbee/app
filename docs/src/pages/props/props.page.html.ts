export default /* html */ `
<ui-page>
  <ui-page-body>
    <page-header>
      <ui-heading type="h1" slot="title">Props</ui-heading>

      <ui-paragraph slot="intro">
        Of course we also need a way to pass properties to components.
        Since every component is just a custom element, we can set the attributes of these elements.
        But we also need a way to control these properties from our components.
      </ui-paragraph>
    </page-header>

    <ui-page-content>

      <ui-heading type="h2">Template</ui-heading>

      <ui-paragraph>
        Say we have a custom button that has two properties a user can control, <code>type</code>, <code>variant</code> and <code>disabled</code>.
        <br/><br/>
        Our template will look something like the following.
      </ui-paragraph>

      <syntax-highlighting language="html">
        <textarea>
<!-- null will remove the prop -->
<button
  *bind:type="type"
  *bind:disabled="disabled ? true : null"
  *bind:class="['button-variant--' + variant]"
>
  <slot></slot>
</button>
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Styling</ui-heading>

      <ui-paragraph>
        Let's add some styling to our template.
        <br/>
        <br/>
        The css variables are comming from a material design theme I created.
        <br/>
        <br/>
        <strike>By the way, if you wonder what isn't the syntax highlighting isn't working, it's because I have not completed the tokanization for css. <span class="smiley">🥲</span></strike>
      </ui-paragraph>

      <syntax-highlighting language="css">
        <textarea>
:host {
  --ui-button-container-color: var(--ui-sys-color-primary);
  --ui-button-container-height: calc(var(--ui-sys-unit) * 40);
  --ui-button-container-padding-left: calc(var(--ui-sys-unit) * 24);
  --ui-button-container-padding-right: calc(var(--ui-sys-unit) * 24);
  --ui-button-container-shape: var(--ui-sys-shape-corner-small);
  --ui-button-container-opacity: 1;

  --ui-button-label-font: var(--ui-sys-typescale-label-large-font-family-name);
  --ui-button-label-opacity: 1;
  --ui-button-label-color: var(--ui-sys-color-on-primary);
  --ui-button-label-size: var(--ui-sys-typescale-label-large-font-size);
  --ui-button-label-weight: var(--ui-sys-typescale-label-large-font-weight);
  --ui-button-label-line-height: var(
    --ui-sys-typescale-label-large-line-height
  );
  --ui-button-label-tracking: var(
    --ui-sys-typescale-label-large-letter-spacing
  );
}

button {
  background: none;
  border: none;
  margin: 0;
  cursor: pointer;
  height: var(--ui-button-container-height);
  padding-left: var(--ui-button-container-padding-left);
  padding-right: var(--ui-button-container-padding-right);
  border-radius: var(--ui-button-container-shape);
  border-radius: var(--ui-button-container-shape);
  color: hsl(var(--ui-button-label-color), var(--ui-button-label-opacity));
  background-color: hsl(var(--ui-button-container-color), var(--ui-button-container-opacity));
  font-family: var(--ui-outlined-button-label-font);
  font-size: var(--ui-outlined-button-label-size);
  font-weight: var(--ui-outlined-button-label-weight);
  line-height: var(--ui-outlined-button-label-line-height);
}

.button-variant--outlined {
  --ui-button-container-opacity: 0;
  --ui-button-label-color: var(--ui-sys-color-primary);

  border: 1px solid hsl(var(--ui-sys-color-primary));
}

:host([disabled]) {
  --ui-button-container-color: var(--ui-sys-color-on-surface) !important;
  --ui-button-container-opacity: 0.12;
  --ui-button-label-opacity: 0.38;
  --ui-button-label-color: var(--ui-sys-color-on-surface);
  --ui-button-icon-color: var(--ui-sys-color-on-surface);

  button {
    cursor: unset;
  }
}
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Component</ui-heading>

      <ui-paragraph>
        Now we need to tell our component what props to accept.
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
import {
  defineComponent,
} from '@digitalbranch/app';

import template from './ui-button.html';
import css from './ui-button.css';

export const uiButton = defineComponent({
  name: 'ui-button',
  props: [{
    name: 'type',
    type: 'string',
    default: 'button'
  },
  {
    name: 'variant',
    type: 'string',
    default: 'filled'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false
  }],
  template,
  css,
});
        </textarea>
      </syntax-highlighting>

      <ui-paragraph>
        For each prop we define the <code>name</code> of the prop, the <code>type</code> of the prop and in our case an optional <code>default</code> value.
      </ui-paragraph>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Result</ui-heading>

      <ui-paragraph>
        And voila. <span class="smiley">😎</span>
      </ui-paragraph>

      <div id="root" *skip>
        <div class="select">
          <select name="buttonVariant" *model="buttonVariant">
            <option value="filled">Filled</option>
            <option value="outlined">Outlined</option>
          </select>
        </div>
        <div class="select">
          <select name="buttonDisabled" *model="buttonDisabled">
            <option value="false">Enabled</option>
            <option value="true">Disabled</option>
          </select>
        </div>

        <ui-button
          *bind:variant="buttonVariant"
          *bind:disabled="buttonDisabled === 'true' ? true : null"
        >
          My button
        </ui-button>
      </div>
    </ui-page-content>
  </ui-page-body>
</ui-page>
`
