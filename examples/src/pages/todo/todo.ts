import { createComponent } from '@digitalbranch/app'
import main from './main/main'
import { uiButton } from './ui'

import './todo.css'

const app = createComponent({
  el: '#app',
  components: {
    main,
    uiButton,
  },
  data() {
    return {
      title: 'My Todo app',
      counter: 0,
      user: {
        person: {
          firstname: 'Vincent',
          lastname: 'Corbee',
        },
      },
    }
  },
  computed: {
    fullName(): string {
      return `${this.user.person.firstname} ${this.user.person.lastname}`
    },
  },
  methods: {
    add(number: number) {
      this.counter += number
    },
  },
})

export default app
