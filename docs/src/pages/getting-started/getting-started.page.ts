import { createApp, defineComponent } from '@digitalbranch/app'

import template from './getting-started.page.html'
import css from './getting-started.page.css'

export const gettingStartedPage = defineComponent({
  name: 'getting-started-page',
  css,
  template,
  listeners: {
    ready() {
      const myComponent = defineComponent({
        name: 'my-component',
        template: /* html */ `
        <div id="app">
          <div>Count is: {{ count }}</div>
          <button @click="handleClick">
            Click me!
          </button>
        </div>
        `,
        data() {
          return {
            count: 0,
          }
        },
        methods: {
          handleClick() {
            this.count++
          },
        },
      })

      createApp({
        el: this.$node.shadowRoot?.querySelector('#root'),
        components: {
          myComponent,
        },
      })

      const mainComponent = defineComponent({
        name: 'main-component',
        css: `
          .count-container {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
          }
          .count {
            font-size: 24px;
            margin-left: 8px;
          }
        `,
        template: /* html */ `
        <div id="app">
          <div class="count-container">Count is: <span class="count">{{ count }}</span></div>
          <ui-button @click="handleClick">
            Click me!
          </ui-button>
        </div>
        `,
        data() {
          return {
            count: 0,
          }
        },
        methods: {
          handleClick() {
            this.count++
          },
        },
      })

      const uiButton = defineComponent({
        name: 'ui-button',
        css: `
          :host {
            --ui-button-background-color: 249, 16%, 32%;
            --ui-button-color: 0, 100%, 100%;
            --ui-button-padding: 16px;
            --ui-button-shape: 8px;

            display: block;
          }

          button {
            border: none;
            background-color: hsl(var(--ui-button-background-color));
            color: hsl(var(--ui-button-color));
            padding: var(--ui-button-padding);
            border-radius: var(--ui-button-shape);
            cursor: pointer;
          }
        `,
        template: `
          <button><slot></slot></button>
        `,
      })

      createApp({
        el: this.$node.shadowRoot?.querySelector('#rootComponent'),
        components: {
          mainComponent,
          uiButton,
        },
      })
    },
  },
})
