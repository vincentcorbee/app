import { defineComponent } from '../../../../src'

import template from './todo-item.html'
import css from './todo-item.css'

export type Todo = {
  id: number
  done: boolean
  text: string
}

const todoItem = defineComponent({
  props: [{ name: 'todo', type: 'object' }],
  template,
  css,
})

export default todoItem
