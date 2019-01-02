import App from '../src/models/App'
import Router from '../src/models/Router'
/* import {
  InputStream,
  TokenStream,
  parse,
  Environment,
  evaluate
} from './helpers/expressionParser'
var code = '4 * 4 === 16 ? true : false' */

// remember, parse takes a TokenStream which takes an InputStream
// var ast = parse(TokenStream(InputStream(code)))
// console.log(ast)
/* const router = new Router()
router.set(
  {
    uri: '/',
    components: {
      main: {
        template: '<div>This is the main view</div>'
      }
    },
    route: req => {
      console.log(req)
    }
  },
  {
    uri: '/user/:id',
    component: {
      template: '<div><h1>User page</h1></div>'
    }
  },
  {
    uri: '/users',
    component: {
      template: '<div><h1>Users page</h1></div>'
    }
  }
)
function F() {
  this.foo = 'FOO'
}
F.prototype.bar = 'BAR' */
const blogPost = {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div a-html="post.content"></div>
    </div>
  `
}
const componentB = {
  data() {
    return {}
  },
  template: `<div><h2>Child of A</h2></div>`
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
      this.prop = 'foo'
    }
  },
  components: {
    'component-b': componentB
  },
  template: `<div>
  <h1>My component A</h1>
  <h2>{{ item.title }}</h2>
  <slot></slot>
  <button a-on:click='clickMe'>Click me</button>{{prop}}
  <component-b></component-b>
  </div>`
}
const todos = new App({
  el: '#todos',
  components: {
    'component-a': componentA,
    'blog-post': blogPost
  },
  data: {
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
      { text: 'Learn Vue', done: false },
      { text: 'Play around in JSFiddle', done: true },
      { text: 'Build something awesome', done: true }
    ]
  },
  listeners: {
    ready() {
      console.log(this)
    }
  },
  methods: {
    toggle: function(todo) {
      todo.done = !todo.done
    },
    addTodo() {
      console.log(this)
      if (this.newTodo) {
        this.todos.push({
          text: this.newTodo,
          done: false
        })
      }
    }
  }
})
/* const app = new App({
  router: router,
  el: '#app',
  components: {
    'component-a': componentA
  },
  data: {
    initialized: false,
    user: {
      username: ''
    },
    blabla: 'Hello',
    blaat: {
      bla: 'Change me',
      deeper: {
        deeperstil: 'HALLO'
      }
    },
    items: [
      {
        title: 'Item 1',
        oldTitle: '',
        edit: false,
        button: 'Edit',
        list: [
          {
            title: 'List item 1'
          },
          {
            title: 'List item 2'
          },
          {
            title: 'List item 3'
          }
        ]
      },
      {
        title: 'Item 2',
        oldTitle: '',
        edit: false,
        button: 'Edit',
        list: [
          {
            title: 'List item 1'
          },
          {
            title: 'List item 2'
          },
          {
            title: 'List item 3'
          }
        ]
      }
    ],
    f: new F(),
    static: 'This does not change',
    somevalue: 'Some value'
  },
  listeners: {
    ready() {
      this.items[0].title = 'CHANGED'
      this.f.foo = 'BAR'
    },
    load() {
      console.log('loading')
    }
  },
  methods: {
    init() {
      let app = this
      app.initialized = true
    },
    addItem() {
      this.items.push({
        title: `Item ${this.items.length + 1}`,
        edit: false,
        button: 'edit',
        list: [
          {
            title: 'List item 1'
          },
          {
            title: 'List item 2'
          },
          {
            title: 'List item 3'
          }
        ]
      })
    },
    addListItem(list) {
      list.push({ title: `List item ${list.length + 1}` })
    },
    removeListItem(list) {
      list.pop()
    },
    removeItem() {
      this.items.pop()
    },
    changeItem(item) {
      item.oldTitle = item.title
      item.edit = !item.edit
      item.button = item.edit ? 'Close' : 'Edit'
    },
    changeValue(e) {
      this.blaat.bla = this.blaat.bla === 'Change me' ? 'Change me back!' : 'Change me'
    }
  }
}) */
export { todos }
