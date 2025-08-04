export default /* html */ `
<ul>
  <li *for="(todo, index) in todos">
    <span>{{ index + 1 }}</span>
    <todo-item *bind:todo="todo"></todo-item>
  </li>
</ul>`
