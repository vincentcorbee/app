import todoItem from '../todo-item/todo-item';

const todoList = {
  props: ['todos'],
  components: {
    todoItem
  },
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" addes html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './todo-list.template.html').then(({ default: template }) => template),
  listeners:{
    ready() {}
  },
}

export default todoList