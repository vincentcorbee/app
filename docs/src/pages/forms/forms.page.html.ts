export default /* html */ `
<ui-page>
  <ui-page-body>
    <ui-heading type="h1">Forms</ui-heading>

    <ui-paragraph>
      But what is an application without forms? Absolutly nothing, so let's build one.
      <br/>
      <br/>
      This example uses typescript and Parcel to run an application.
    </ui-paragraph>

    <ui-divider></ui-divider>

    <ui-heading type="h2">Template</ui-heading>

    <ui-paragraph>
      First we start by creating the template for our component.
    </ui-paragraph>

    <syntax-highlighting language="html">
      <textarea>
<form
  *form="form"
  @submit.prevent="onSubmit()"
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
</form>
      </textarea>
    </syntax-highlighting>

    <ui-paragraph>
      We start off by binding the form element to our form that we will create shortly.
      The way we do this is by using <code>*form</code>.
      <br/>
      <br/>
      Next we use <code>@submit.prevent</code> to listen to the submit event.
      The <code>prevent</code> modifier prevents the default behaviour i.e. submitting the form.
    </ui-paragraph>

    <ui-paragraph>
      Next we need some input fields. In order to connect a field to our form, we use <code>*model</code>.
      This also binds an input eventlistener to the field.
      <br/>
      <br/>
      We also want to show an error message if there is an error.
      For this we add and <code>*if</code> directive the the span element that points to <code>form.lastName.errors.required</code>.
      Now when there is an error, an message is show.
    </ui-paragraph>

    <ui-paragraph>
      We also add an <code>dialog</code> element for showing us what we submitted.
      To toggle the dialog element, we bind to the property open, <code>*bind:open</code>.
      <br/>
      <br/>
      The way to close a dialog is with the form element that has a method <code>dialog</code>.
      To close the dialog from our component we listen to the submit event, <code>@submit</code>.
    </ui-paragraph>

    <ui-paragraph>
      We also add firstName and lastName to our data object so it can be bound to fields.
    </ui-paragraph>

    <ui-divider></ui-divider>

    <ui-heading type="h2">Component</ui-heading>

    <ui-paragraph>
      Now we have to define our component.
    </ui-paragraph>

    <syntax-highlighting language="js">
      <textarea>
import {
  defineComponent,
  FormBuilder,
  requiredValidator
} from '@digitalbranch/app';

import template from './my-form.html';
import css from './my-form.css';

const validators = { required: requiredValidator };
export const myForm = defineComponent({
  name: 'my-form',
  template,
  css,
  data() {
    return {
      /* We use null because that removed the boolean attribute */
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
});
      </textarea>
    </syntax-highlighting>

    <ui-paragraph>
      We create a form by using the <code>FormBuilder</code> class.
      With <code>FormBuilder.form</code> we can create a form. We supply it with an
      object that contains the name of the field and an array with the default value and validators.
      <br/>
      In our case we use the build in <code>requiredValidator</code>.
    </ui-paragraph>

    <ui-divider></ui-divider>

    <ui-heading type="h2">Application</ui-heading>

    <ui-paragraph>
      Now we need to create an application and add our form component.
    </ui-paragraph>

    <syntax-highlighting language="js">
      <textarea>
createApp({
  el: this.$node.shadowRoot?.querySelector('#root'),
  components: {
    myForm,
  },
});
      </textarea>
    </syntax-highlighting>

    <ui-divider></ui-divider>

    <ui-heading type="h2">Index</ui-heading>

    <ui-paragraph>
      Finally we add our application to our html index file.
    </ui-paragraph>

    <syntax-highlighting language="html">
      <textarea>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My app</title>
  </head>
  <body>
    <div id="app" a-cloak>
      <my-form></my-form>
    </div>
  </body>
  <script type="module" src="app.ts"></script>
</html>
      </textarea>
    </syntax-highlighting>

    <ui-divider></ui-divider>

    <ui-heading type="h2">Result</ui-heading>

    <ui-paragraph>
      And we end up with this amazing result! <span class="smiley">🤯</span>
    </ui-paragraph>

    <div id="root">
      <my-form></my-form>
    </div>
  </ui-page-body>
</ui-page>
`
