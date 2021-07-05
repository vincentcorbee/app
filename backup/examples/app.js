import App from '../../src/models/App'
import Router from '../../src/models/Router'

// import Store from './lib/store'

// const actions = {}
// const mutations = {}

const state = {
  user: {
    person: {
      gender: '',
      firstname: '',
      lastname: '',
      age: '',
    },
    address: {
      zipcode: '',
      street: '',
      housenumber: '',
    },
  },
}

// const store = new Store({ actions, mutations, state })

const blogPost = {
  props: ['post'],
  template: (() =>
    import(/* webpackMode: "eager" */ './blog-post.template.html').then(
      ({ default: template }) => template
    ))(),
}
const componentB = {
  data() {
    return {}
  },
  template: `
    <div><h2>Child of A</h2></div>
  `,
}
const componentA = {
  props: ['item'],
  data() {
    return {
      prop: 'Some data',
    }
  },
  methods: {
    clickMe() {
      this.prop = this.prop === 'foo' ? 'bar' : 'foo'
    },
  },
  components: {
    componentB,
  },
  template: `
    <div>
      <h1>My component A</h1>
      <h2>{{ item.title }}</h2>
      <slot></slot> <button on:click="clickMe">Click me</button> {{prop}}
      <component-b></component-b>
    </div>
  `,
}
const todoItem = {
  props: ['todo'],
  data() {
    return {}
  },
  template: `
    <label>
      <input type="checkbox" on:change="toggle(todo)" bind:checked="todo.done" />
      <del if="todo.done"> {{ todo.text }} </del> <span else> {{ todo.text }} </span>
      <span> not me </span>
    </label>
  `,
}
let numbers = []
let count = 0

const todos = []
const posts = [
  {
    id: 1,
    title: 'My journey with App',
    content: '<p>Here is some content</p>',
  },
  {
    id: 2,
    title: 'Blogging with App',
    content: '<p>Here is some content</p>',
  },
  {
    id: 3,
    title: 'Why App is so fun',
    content: '<p>Here is some content</p>',
  },
  {
    id: 4,
    title: 'Why App is so fun',
    content: '<p>Here is some content</p>',
  },
  {
    id: 5,
    title: 'Why App is so fun',
    content: '<p>Here is some content</p>',
  },
  {
    id: 6,
    title: 'Why App is so fun',
    content: '<p>Here is some content</p>',
  },
  {
    id: 7,
    title: 'Why App is so fun',
    content: '<p>Here is some content</p>',
  },
]

for (let i = 0, l = 1; i < l; i += 1) {
  todos.push(
    { text: 'Learn JavaScript', done: false },
    { text: 'Learn App', done: false },
    { text: 'Play around in JSFiddle', done: true },
    { text: 'Build something awesome', done: true }
  )
}

while (count <= 10) {
  numbers.push(count)
  count += 1
}

const router = new Router()

router.set(
  {
    uri: '/',
    components: {
      main: {
        components: {
          todoItem,
          componentA,
          blogPost,
        },
        data() {
          return {
            numbers,
            postFontSize: 1,
            posts,
            title: 'Todos:',
            item: {
              title: 'Component title',
            },
            newTodo: '',
            todos,
          }
        },
        methods: {
          async enlargeText(e) {
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
          addTodo() {
            if (this.newTodo) {
              this.todos.push({
                text: this.newTodo,
                done: false,
              })
            }
          },
          removeTodo(index) {
            this.todos.splice(index, 1)
            // this.todos.push(todo)
          },
        },
        template: (() =>
          import(/* webpackMode: "eager" */ './main.template.html').then(
            ({ default: template }) => template
          ))(),
      },
    },
  },
  {
    uri: '/overview',
    component: {
      data() {
        return state
      },
      computed: {
        fullName() {
          return `${this.user.person.firstname + this.user.person.lastname}`
        },
      },
      template: `
        <div a-cloak>
          <h1>Overview</h1>
          {{ fullName }}
          <div class="formWrapper">
            <form id="form">
              <div>
                <div>
                  <span>Gender</span>
                  <div>
                    <label for="male">
                      <span>Male</span>
                      <input
                        type="radio"
                        a-model="user.person.gender"
                        value="male"
                        id="male"
                      />
                    </label>
                    <label for="female">
                      <span>Female</span>
                      <input
                        type="radio"
                        a-model="user.person.gender"
                        value="female"
                        id="female"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label for="firstname">Firstname</label>
                  <input type="text" id="firstname" a-model="user.person.firstname" />
                </div>
                <div>
                  <label for="lastname">Lastname</label>
                  <input type="text" id="lastname" a-model="user.person.lastname" />
                </div>
                <div>
                  <label for="age">Age</label>
                  <input type="number" id="lastname" a-model="user.person.age" />
                </div>
              </div>
              <div>
                <div>
                  <label for="zipcode">Zipcode</label>
                  <input type="text" id="zipcode" a-model="user.address.zipcode" />
                </div>
                <div>
                  <label for="street">Street</label>
                  <input type="text" id="street" a-model="user.address.street" />
                </div>
                <div>
                  <label for="housenumber">Housenumber</label>
                  <input
                    type="number"
                    id="housenumber"
                    a-model="user.address.housenumber"
                  />
                </div>
              </div>
              <pre>{{ user }}</pre>
            </form>
          </div>
        </div>
      `,
    },
  },
  {
    uri: '/user/:id',
    component: {
      data() {
        return {
          blaat: 'BLAAAAA',
        }
      },
      template: `
        <div>
          <h1>User page {{ $route.params.id }}</h1>
          <p>{{blaat}}</p>
        </div>
      `,
    },
  },
  {
    uri: '/users',
    component: {
      data() {
        return {
          users: [
            {
              firstname: 'Vincent',
              lastname: 'corbee',
            },
          ],
        }
      },
      template: `
        <div>
          <h1>Users page</h1>
          <div>
            <div *for="user in users">
              <div>
                <span>{{ user.firstname }}</span>
              </div>
              <div>
                <span>{{ user.lastname }}</span>
              </div>
            </div>
          </div>
        </div>
      `,
    },
  }
)

const app = new App({
  el: '#app',
  router,
  data: {},
  methods: {
    addFile(e) {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')

      const reader = new FileReader()

      reader.onload = function (event) {
        const img = new Image()

        img.onload = function () {
          const width = img.width * 0.5
          const height = img.height * 0.5
          canvas.width = width
          canvas.height = height
          // ctx.filter = 'grayScale()'
          ctx.drawImage(img, 0, 0, width, height)

          ctx.globalAlpha = 0.3

          ctx.font = '80px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Copy', width / 2, (height + 60) / 2)
        }

        img.src = event.target.result
      }

      reader.readAsDataURL(e.target.files[0])
    },
    add(i) {
      return i + 5
    },
  },
})

console.log(app)
