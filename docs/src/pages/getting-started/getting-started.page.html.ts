export default /* html */ `
<ui-page>
  <ui-page-body>
    <page-header>
      <ui-heading type="h1" slot="title">Creating an application</ui-heading>

      <ui-paragraph slot="intro">
        To create an application, we import <code>createApp</code>. This function creates an application which basically is just an component.
        The only difference is that we mount this component directly into the DOM by passing the <code>el</code> property.
      </ui-paragraph>
    </page-header>

    <ui-page-content>
      <ui-heading type="h2">Application instance</ui-heading>
      <ui-paragraph>
        In this example next to the mounting point, we use the data property to determine our state.
        We can also among other things listen to life cycle events.
        In this example we listen to the ready event. We also want to communicate witht the DOM.
        In order to do that, we can define listeners in the methods property.
        In this example we have an on click handler that updates the count propery in our state.

        <br/>
        <br/>

        By the way the syntax highlighting is also created in this framework with custom lexers. <span class="smily">🥸</span>
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
import { createApp } from '@digitalbranch/app';

createApp({
  el: '#app',
  data() {
    return {
      count: 0,
    }
  },
  listeners: {
    ready() {
      'Application is ready!'
    },
  },
  methods: {
    handleClick() {
      this.count++
    },
  }
});
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">HTML template</ui-heading>

      <ui-paragraph>
        In this example we are using Parcel to create our application. We can now simply import our app component.
        We added one button to the page.
        To this button we added a click event listener with the <code>@click</code> directive which points to our <code>handleClick</code> method.
        We also show the current count on the screen.
      </ui-paragraph>

      <syntax-highlighting language="html">
        <textarea *skip>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My app</title>
  </head>
  <body>
    <div id="app" a-cloak>
      <div>Count is: {{ count }}</div>
      <button @click="handleClick">
        Click me!
      </button>
    </div>
  </body>
  <script type="module" src="app.ts"></script>
</html>
        </textarea>
      </syntax-highlighting>

      <ui-heading type="h2">Result</ui-heading>

      <div id="root">
        <my-component></my-component>
      </div>

      <ui-divider variant="full-width"></ui-divider>

      <ui-heading type="h1">Creating components</ui-heading>

      <ui-paragraph>
        Of course we want to seperate our application in differen components.
        So let's split the example above up into multiple components.
      </ui-paragraph>
      <ui-paragraph>
        We will have our application, which also is just a component, a main component, and a button component.
      </ui-paragraph>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Main component</ui-heading>

      <ui-paragraph>
        In stead of createComponent, we use <code>defineComponent</code>.
        This is a typescript helper function that gives us some type information while working with the component.
        What we are creating is just a configuration for a component, that we will pass to our app component.
        This will actually create the component for us.
      </ui-paragraph>

      <ui-paragraph>
        We can add our layout through the <code>css</code> and <code>template</code> property.
        Every component end's up being a custom element that has the shadow dom enabled.
        This means that all the styling is encapsulated in the component.
        In order to style the component from the outside, we can use <strong>css variables</strong>.
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea *skip>
import { defineComponent } from '@digitalbranch/app';

export const mainComponent = defineComponent({
  name: 'main-component',
  css: \`
    .count-container {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }
    .count {
      font-size: 24px;
      margin-left: 8px;
    }
        \`,
  template: \`
    <div class="count-container">Count is: <span class="count">{{ count }}</span></div>
    <ui-button @click="handleClick">
      Click me!
    </ui-button>
  \`,
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    handleClick() {
      this.count++
    },
  }
});
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Button component</ui-heading>

      <ui-paragraph>
        Now let's create our button component.

      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
import { defineComponent } from '@digitalbranch/app';

export const uiButton = defineComponent({
  name: 'ui-button'
  css: \`
    :host {
      --ui-button-background-color: 249, 16%, 32%;
      --ui-button-color: 0, 100%, 100%;

      display: block;
    }

    button {
      border: none;
      background-color: hsl(var(--ui-button-background-color));
      color: hsl(var(--ui-button-color));
    }
  \`,
  template: \`
    <button><slot></slot></button>
  \`,
});
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">App component</ui-heading>

      <ui-paragraph>
        Now we only have to change our application. We remove the data and methods from our application.
        Because we are using two components in our application, we need to add them. We do this via the components property.
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
import { createApp } from '@digitalbranch/app';
import { mainComponent, uiButton } from 'components';

createApp({
  el: '#app',
  components: {
    mainComponent,
    uiButton
  }
});
        </textarea>
      </syntax-highlighting>

      <ui-heading type="h2">Result</ui-heading>

      <div id="rootComponents">
        <main-component></main-component>
      </div>

      <ui-divider variant="full-width"></ui-divider>

      <ui-heading type="h1">Easy peasy lemon squeezi</ui-heading>

      <ui-paragraph>
        Everything you will ever need. By the way, this entire page is build with this framework. <span class="smiley">🥸</span>
      </ui-paragraph>
    </ui-page-content>
  </ui-page-body>
</ui-page>
`
