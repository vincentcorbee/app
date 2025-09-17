import {
  createApp,
  defineComponent,
  FormBuilder,
  requiredValidator,
} from '@digitalbranch/app'

import template from './forms.page.html'
import css from './forms.page.css'

export const formsPage = defineComponent({
  name: 'forms-page',
  template,
  css,
  listeners: {
    ready() {
      const css = /* css */ `
      form {
        display: inline-flex;
        flex-direction: column;
      }
      .error {
        color: red;
      }
      .row {
        display: inline-flex;
        flex-direction: column;

        &:not(:last-of-type) {
          margin-bottom: 24px;
        }
      }
      `
      const template = /* html */ `
      <form
        @submit.prevent="onSubmit()"
        *form="form"
        novalidate>
        <div class="row">
          <label for="firstName">First name</label>
          <input type="text" id="firstName" name="firstName" *model="firstName" required />
          <span class="error" *if="form.firstName.errors.required">
            First name is required
          </span>
        </div>
        <div class="row">
          <label for="lastName">Last name</label>
          <input type="text" id="lastName" name="lastName" *model="lastName" required />
          <span class="error" *if="form.lastName.errors.required">
            Last name is required
          </span>
        </div>
        <div class="row">
          <button>Submit</button>
        </div>
        <dialog *bind:open="dialogOpen">
          <div *if="dialogOpen">
            <div>First name: {{firstName}}</div>
            <div>Last name: {{lastName}}</div>
          </div>
          <div>
            <form method="dialog" @submit="closeDialog">
              <button>
                Close
              </button>
            </form>
          </div>
        </dialog>
      </form>`
      const validators = { required: requiredValidator }
      const myForm = defineComponent({
        name: 'my-form',
        template,
        css,
        data() {
          return {
            dialogOpen: null,
            firstName: '',
            lastName: '',
            form: FormBuilder.form({
              firstName: ['', validators],
              lastName: ['', validators],
            }),
          }
        },
        methods: {
          onSubmit() {
            this.dialogOpen = true
          },
          closeDialog() {
            this.dialogOpen = null
          },
        },
      })

      createApp({
        el: this.$node.shadowRoot?.querySelector('#root'),
        components: {
          myForm,
        },
      })
    },
  },
})
