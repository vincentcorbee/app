import { defineComponent } from '../../../../../src'

export type Todo = {
  id: number
  done: boolean
  text: string
}

const todoItem = defineComponent({
  props: ['todo'],
  template: import(/* webpackMode: "eager" */ './todo-item.template.html').then(
    ({ default: template }) => template
  ),
})

export default todoItem
