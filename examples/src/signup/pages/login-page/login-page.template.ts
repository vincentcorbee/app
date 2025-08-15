const template = /* html */ `
<style>
  * {
    box-sizing: border-box;
  }

  :host {
    --color-error: #f44336;
    --color-blue: #3f51b5;
  }

  h1 {
    margin-top: 0;
  }

  .row:not(:last-child) {
    margin-bottom: var(--offset-md);
  }

  .fc-field {
    position: relative;
    display: inline-flex;
    height: 56px;
    background-color: #f5f5f5;
    --background-color-blue: #14cded;
  }

  .fc-field label {
    left: 16px;
    right: initial;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1rem;
    position: absolute;
    transform-origin: left top;
    line-height: 1.15rem;
    transition: transform 150ms;
  }

  .fc-field input {
    padding: 20px 16px 6px;
    font-size: 1rem;
    border: none;
    margin: 0;
    border-bottom: 1px solid;
    width: 100%;
    height: 100%;
    align-self: flex-end;
    box-sizing: border-box;
    background-color: transparent;
  }

  .fc-field input.fc-invalid {
    border-bottom-color: var(--color-error);
    color: var(--color-error);
  }

  .fc-field input.fc-invalid + label {
    color: var(--color-error);
  }

  .fc-field input:focus {
    outline: none;
  }

  .fc-field input:focus:not(.fc-invalid) {
    border-bottom: 1px solid var(--background-color-blue);
  }

  .fc-field input:focus + label,
  .fc-field input:not(:placeholder-shown) + label {
    transform: translateY(-106%) scale(0.75);
  }

  .fc-error {
    color: var(--color-error);
    margin-top: 4px;
    font-size: 0.75rem;
  }
</style>
<div>
  <h1>{{title}}</h1>
  <form @submit.prevent="onSubmit()" *form="login">
    <div class="row">
      <div class="fc-field">
        <input
          type="text"
          id="username"
          name="username"
          *model="username"
          placeholder=" "
        />
        <label for="username">Username</label>
      </div>
      <div class="fc-error" *if="login.formControls.username.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-field">
        <input
          type="password"
          name="password"
          id="password"
          *model="password"
          placeholder=" "
        />
        <label for="password">Password</label>
      </div>
      <div class="fc-error" *if="login.formControls.password.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <ui-button type="submit">Login</ui-button>
    </div>
  </form>

  <ui-modal *ref="modal">
    <span slot="header">Logged in</span>
    <div slot="main">{{ username }} is logged in.</div>
    <div slot="footer">
      <ui-button type="button" @click="closeModal">Close</ui-button>
    </div>
  </ui-modal>
</div>`

export default template
