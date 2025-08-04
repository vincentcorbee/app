import { defineComponent } from '@digitalbranch/app'
import { Todo } from '../todo-item/todo-item'
import todoList from '../todo-list/todo-list'
import { uiButton, uiInput } from '../ui'

import template from './main.html'
import css from './main.css'

type State = {
  loading: boolean
  todos: Todo[] | null
  newTodo: string
  action: string
  type: 'text' | 'number'
}

const main = defineComponent({
  name: 'app-main',
  components: {
    uiButton,
    uiInput,
    todoList,
  },
  template,
  css,
  data(): State {
    return {
      loading: false,
      todos: null,
      newTodo: '',
      action: '',
      type: 'text',
    }
  },
  listeners: {
    async ready() {
      setTimeout(async () => {
        const res = await fetch('http://localhost:3009/todos')
        const todos = await res.json()

        this.todos = todos
      }, 1000)
    },
  },
  methods: {
    toggle(todo: Todo) {
      todo.done = !todo.done

      this.loading = true

      setTimeout(async () => {
        await fetch(`http://localhost:3009/todos/${todo.id}`, {
          method: 'put',
          body: JSON.stringify(todo),
          headers: { 'content-Type': 'application/json' },
        })

        this.loading = false
      }, 500)
    },
    update(value: any) {
      this.newTodo = value
    },
    async addTodo() {
      if (this.newTodo) {
        this.loading = true
        this.action = 'add'

        const newTodo = {
          id: new Date().getTime(),
          text: this.newTodo,
          done: false,
        }

        setTimeout(async () => {
          await fetch('http://localhost:3009/todos', {
            method: 'post',
            body: JSON.stringify(newTodo),
            headers: { 'content-Type': 'application/json' },
          })

          if (!this.todos) this.todos = [newTodo]
          else this.todos.push(newTodo)

          this.loading = false
          this.action = ''
          this.newTodo = ''
        }, 500)
      }
    },
    async removeTodo(id: number) {
      this.loading = true
      this.action = 'remove'

      setTimeout(async () => {
        await fetch(`http://localhost:3009/todos/${id}`, { method: 'delete' })

        this.todos = this.todos ? this.todos.filter((todo: Todo) => todo.id !== id) : []
        this.action = ''
        this.loading = false
      }, 500)
    },
  },
})

export default main
