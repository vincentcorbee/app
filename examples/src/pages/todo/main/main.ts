import { defineComponent } from '@digitalbranch/app'
import { Todo } from '../todo-item/todo-item'
import todoList from '../todo-list/todo-list'
import { uiButton, uiInput } from '../ui'

const main = defineComponent({
  name: 'app-main',
  components: {
    uiButton,
    uiInput,
    todoList,
  },
  template: import(/* webpackMode: "eager" */ './main.template.html').then(
    ({ default: template }) => template
  ),
  data() {
    return {
      title: 'TITEL',
      loading: false,
      todos: null as null | Todo[],
      arr: [] as number[],
      newTodo: '',
      action: '',
      test: {},
      foo: {
        doSomething(a = 0, b = 0) {
          return a + b + 10
        },
      },
      type: 'text',
    }
  },
  listeners: {
    async ready() {
      this.arr = [1, 2, 3, 4]
      this.test = {
        text: 'hoi',
      }
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

        console.log('newTodo', newTodo)

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
