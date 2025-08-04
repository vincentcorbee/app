import { defineComponent } from '../../../../src'
import todoItem from '../todo-item/todo-item'

import template from './todo-list.html'
import css from './todo-list.css'

const todoList = defineComponent({
  props: [{ name: 'todos', type: 'array' }],
  components: {
    todoItem,
  },
  template,
  css,
})

export default todoList
