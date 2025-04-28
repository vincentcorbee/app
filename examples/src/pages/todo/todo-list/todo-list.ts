import { defineComponent } from '../../../../../src'
import todoItem from '../todo-item/todo-item'

const todoList = defineComponent({
  props: ['todos'],
  components: {
    todoItem,
  },
  template: import(/* webpackMode: "eager" */ './todo-list.template.html').then(
    ({ default: template }) => template
  ),
})

export default todoList
