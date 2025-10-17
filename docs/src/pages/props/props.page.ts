import { createApp, defineComponent } from '@digitalbranch/app'

import template from './props.page.html'
import css from './props.page.css'

export const propsPage = defineComponent({
  name: 'props-page',
  template,
  css,
  listeners: {
    ready() {
      const template = /* html */ `
        <button
          *bind:type="type"
          *bind:disabled="disabled ? true : null"
          *bind:class="['button-variant--' + variant]"
        >
          <slot></slot>
        </button>
      `
      const css = /* css */ `
      :host {
        --ui-button-container-color: var(--ui-sys-color-primary);
        --ui-button-container-height: calc(var(--ui-sys-unit) * 40);
        --ui-button-container-padding-left: calc(var(--ui-sys-unit) * 24);
        --ui-button-container-padding-right: calc(var(--ui-sys-unit) * 24);
        --ui-button-container-shape: var(--ui-sys-shape-corner-small);
        --ui-button-container-opacity: 1;

        --ui-button-outline-color: var(--ui-sys-color-primary);
        --ui-button-outline-opacity: 0;

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
        border: 1px solid hsl(var(--ui-button-outline-color), var(--ui-button-outline-opacity));
      }
      .button-variant--filled {

      }
      .button-variant--outlined {
        --ui-button-container-opacity: 0;
        --ui-button-label-color: var(--ui-sys-color-primary);
        --ui-button-outline-opacity: 1;
      }

      :host([disabled]) {
        --ui-button-container-color: var(--ui-sys-color-on-surface) !important;
        --ui-button-container-opacity: 0.12;
        --ui-button-label-opacity: 0.38;
        --ui-button-label-color: var(--ui-sys-color-on-surface);
        --ui-button-icon-color: var(--ui-sys-color-on-surface);

        .button-variant--outlined {
          --ui-button-outline-opacity: 0.38;
        }

        button {
          cursor: unset;
        }
      }
      `
      const uiButton = defineComponent({
        name: 'ui-button',
        props: [
          {
            name: 'type',
            type: 'string',
            default: 'button',
          },
          {
            name: 'variant',
            type: 'string',
            default: 'filled',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: false,
          },
        ],
        template,
        css,
      })

      createApp({
        el: this.$node.shadowRoot?.querySelector('#root'),
        data() {
          return {
            buttonVariant: 'filled',
            buttonDisabled: 'false',
          }
        },
        components: {
          uiButton,
        },
      })
    },
  },
})
