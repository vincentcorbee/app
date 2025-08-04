export default /* html */ `
<label>
  <input type="checkbox" @change="toggle(todo)" *bind:checked="todo.done" />
  <del *if="todo.done"> {{ todo.text }} </del> <span *else> {{ todo.text }} </span>
  <ui-button type="button" @click="emit('remove-todo', todo.id)">Remove</ui-button>
</label>`
