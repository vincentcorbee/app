export default /* html */ `
<div class="ui-field">
  <input *bind:type="type" *bind:value="value" placeholder="" @input="onInput" />
  <label for="username"><slot name="label"></slot></label>
</div>`
