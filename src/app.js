import App from '../lib/App'
import Router from './models/Router'
import { html } from 'lit-html'

class Person {
  constructor() {
    this.name = 'Jaap'
  }
  sayName() {
    console.log(this.name)
  }
}

const exponent = (base, exponent) => {
  let result = 1
  while (exponent) {
    result *= base
    exponent -= 1
  }
  return result
}
const log2 = num => {
  for (let exp = 0; exp <= num; exp += 1) {
    const next = exp + 1
    if (exponent(2, next) > num) {
      return exp
    }
  }
}
const createList = num => {
  const arr = []
  while (num) {
    arr.push(num)
    num -= 1
  }
  return arr
}

const listLength = (list = null, length = 0) => {
  try {
    return list.pop() ? listLength(list, length + 1) : length
  } catch (e) {
    return { err: length }
  }
}

// console.log(log2(1))

const router = new Router()

router.set(
  {
    uri: '/',
    components: {
      main: {
        template: html`
          <div><h1>Main One</h1></div>
        `
      }
    }
  },
  {
    uri: '/overview',
    component: {
      template: html`
        <div><h1>Overview</h1></div>
      `
    }
  },
  {
    uri: '/user/:id',
    component: {
      data() {
        return {
          blaat: 'BLAAAAA'
        }
      },
      template: html`
        <div>
          <h1>User page {{ $route.params.id }}</h1>
          <p>{{blaat}}</p>
        </div>
      `
    }
  },
  {
    uri: '/users',
    component: {
      template: html`
        <div><h1>Users page</h1></div>
      `
    }
  }
)
const blogPost = {
  props: ['post'],
  template: html`
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button on:click="emit('enlarge-text')">Enlarge text</button>
      <button on:click="emit('shrink-text')">Shrink text</button>
      <div html="post.content"></div>
    </div>
  `
}
const componentB = {
  data() {
    return {}
  },
  template: html`
    <div><h2>Child of A</h2></div>
  `
}
const componentA = {
  props: ['item'],
  data() {
    return {
      prop: 'Some data'
    }
  },
  methods: {
    clickMe() {
      this.prop = this.prop === 'foo' ? 'bar' : 'foo'
    }
  },
  components: {
    componentB
  },
  template: html`
    <div>
      <h1>My component A</h1>
      <h2>{{ item.title }}</h2>
      <slot></slot> <button on:click="clickMe">Click me</button> {{prop}}
      <component-b></component-b>
    </div>
  `
}
const todoItem = {
  props: ['todo'],
  data() {
    return {}
  },
  template: html`
    <label>
      <input type="checkbox" on:change="toggle(todo)" bind:checked="todo.done" />
      <del if="todo.done"> {{ todo.text }} </del> <span else> {{ todo.text }} </span>
      <span> not me </span>
    </label>
  `
}
const app = new App({
  el: '#form',
  data: {
    user: {
      person: {
        gender: '',
        firstname: '',
        lastname: '',
        age: ''
      },
      address: {
        zipcode: '',
        street: '',
        housenumber: ''
      }
    }
  },
  listeners: {
    ready() {}
  }
})
console.log(app)
/* new App({
  el: '#todos',
  router,
  components: {
    componentA,
    blogPost,
    todoItem
  },
  data: {
    Person,
    person: null,
    postFontSize: 1,
    posts: [
      { id: 1, title: 'My journey with App', content: '<p>Here is some content</p>' },
      { id: 2, title: 'Blogging with App', content: '<p>Here is some content</p>' },
      { id: 3, title: 'Why App is so fun', content: '<p>Here is some content</p>' }
    ],
    title: 'Todos:',
    item: {
      title: 'Component title'
    },
    newTodo: '',
    todos: [
      { text: 'Learn JavaScript', done: false },
      { text: 'Learn App', done: false },
      { text: 'Play around in JSFiddle', done: true },
      { text: 'Build something awesome', done: true }
    ]
  },
  listeners: {
    ready() {
      this.person = new this.Person()
    }
  },
  methods: {
    async enlargeText() {
      this.postFontSize += 0.1
      // innerHTML not updated
      await this.$nextTick()
      // innerHTML updated
    },
    shrinkText() {
      this.postFontSize -= 0.1
    },
    toggle(todo) {
      todo.done = !todo.done
    },
    add(i) {
      return i + 5
    },
    addTodo() {
      if (this.newTodo) {
        this.todos.push({
          text: this.newTodo,
          done: false
        })
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1)
      // this.todos.push(todo)
    }
  }
}) */
