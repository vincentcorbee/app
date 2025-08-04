export default /* html */ `
<div>
  <h1>{{title}}</h1>
  <form @submit.prevent="onSubmit()" *form="signup">
    <div class="row">
      <div class="fc-field">
        <input
          type="text"
          id="firstname"
          name="firstname"
          *model="user.firstname"
          placeholder=" "
        />
        <label for="firstname">Firstname</label>
      </div>
      <div class="fc-error" *if="signup.formControls.firstname.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-field">
        <input
          type="text"
          id="lastname"
          name="lastname"
          *model="user.lastname"
          placeholder=" "
        />
        <label for="lastname">Lastname</label>
      </div>
      <div class="fc-error" *if="signup.formControls.lastname.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-radio-group">
        <label class="">Gender</label>
        <div class="fc-radio-group__container">
          <div class="fc-radio" *for="gender of genders">
            <label *bind:for="'gender-' + gender.value">
              <input
                type="radio"
                name="gender"
                *model="$parent.user.gender"
                *bind:value="gender.value"
                *bind:id="'gender-' + gender.value"
                aria-hidden="true"
              />
              <div class="fc-radio-button">
                <div class="fc-radio-button__outer"></div>
                <div class="fc-radio-button__inner"></div>
              </div>
              <div class="fc-radio-button-label">
                <span>{{gender.label}}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="fc-error" *if="signup.formControls.gender.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-field">
        <input
          type="number"
          name="age"
          id="age"
          *model.number="user.age"
          placeholder=" "
        />
        <label for="age">Age</label>
      </div>
      <div class="fc-error" *if="signup.formControls.age.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-field">
        <input
          type="password"
          name="password"
          id="password"
          *model="user.password"
          placeholder=" "
        />
        <label for="password">Password</label>
      </div>
      <div class="fc-error" *if="signup.formControls.password.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row">
      <div class="fc-field">
        <input
          type="password"
          name="passwordControl"
          id="passwordControl"
          *model="passwordControl"
          placeholder=" "
        />
        <label for="passwordControl">Password control</label>
      </div>
      <div class="fc-error" *if="signup.formControls.passwordControl.errors.required">
        This field is required.
      </div>
    </div>
    <div class="row" *if="signup.formGroups.passwords.errors.passwordMatch">
      <div class="fc-error">Passwords don't match.</div>
    </div>
    <div class="row">
      <ui-button type="submit">Signup</ui-button>
    </div>
  </form>

  <ui-modal *ref="modal">
    <span slot="header">Signup complete</span>
    <div slot="main">
      Thank you for signing up
      <pre>{{ newUser }}</pre>
    </div>
    <div slot="footer">
      <ui-button type="button" @click="closeModal">Close</ui-button>
    </div>
  </ui-modal>
</div>`
