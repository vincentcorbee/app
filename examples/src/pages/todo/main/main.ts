// import './main.css'

import { Todo } from '../todo-item/todo-item'
import todoList from '../todo-list/todo-list'

const main = {
  name: 'app-main',
  components: {
    todoList
  },
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" addes html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './main.template.html').then(({ default: template }) => template),
  /*
    data for a component should be a function that returns an object
    so that every instance of the component get's it's own instance of the data.
  */
  data() {
    return {
      title: 'TITEL',
      loading: false,
      todos: null,
      arr: [],
      newTodo: '',
      action: '',
      test: {}
    }
  },
  listeners: {
    async ready() {
      this.arr = [1,2,3,4]
      this.test = {
        text: 'hoi'
      }
      setTimeout(async () => {
        const res = await fetch('http://localhost:3000/todos')
        const todos = await res.json()
        this.todos = todos
      } ,1000)
    }
  } as any,
  methods: {
    toggle(todo: Todo) {
      todo.done = !todo.done
    },
    async addTodo() {
      if (this.newTodo) {
        this.loading = true
        this.action = 'add'

        const newTodo = {
          id: this.todos.length + 1,
          text: this.newTodo,
          done: false,
        }

        setTimeout(async () => {
          await fetch('http://localhost:3000/todos', { method: 'post', body: JSON.stringify(newTodo), headers: { 'content-Type': 'application/json' } })

          this.todos.push(newTodo)

          this.loading = false
          this.action = ''
          this.newTodo = ''

        }, 500)
      }
    },
    async removeTodo(id: number) {
      this.loading = true
      this.action = 'remove'

      // const todo = this.todos.find((todo: Todo) => todo.id === id)

      setTimeout(async () => {
        await fetch(`http://localhost:3000/todos/${id}`, { method: 'delete' })

        const todos = this.todos.filter((todo: Todo) => todo.id !== id)

        this.todos = todos
        this.action = ''
        this.loading = false
      }, 500)
    },
  } as any
}

export default main