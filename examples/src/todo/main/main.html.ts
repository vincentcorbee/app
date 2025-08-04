export default /* html */ `
<div *if="loading" class="loader">{{ action }}</div>
<!-- <div *if="bar" class="flex flex-direction-column">
  <div class="flex flex-direction-column">
    <div class="row">
      <ui-input type="text" @update="update" *bind:value="newTodo">
        <span slot="label">New todo</span>
      </ui-input>
      <ui-button type="button" @click="addTodo">Add todo</ui-button>
    </div>
  </div>
</div> -->

<div *if="todos" class="flex flex-direction-column">
  <h1>Todos: {{ todos.length }}</h1>
  <div class="row">
    <ui-input *bind:type="type" @update="update" *bind:value="newTodo">
      <span slot="label">New todo</span>
    </ui-input>
    <!-- <div class="fc-field">
      <input type="text" *model="newTodo" placeholder=" " />
      <label for="username">New todo</label>
    </div> -->
    <ui-button type="button" @click="addTodo">Add todo</ui-button>
  </div>
  <div class="flex">
    <div class="flex-1">
      <todo-list *bind:todos="todos" @remove-todo="removeTodo" />
    </div>
  </div>
</div>
<div *else>
  <span>Loading</span>
</div>
`
