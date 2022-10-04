import App from '@App'
import main from './main/main'

import './todo.css'

const app = new App({
  el: '#app',
  components: {
    main
  },
  data: {
    title: 'My Todo app',
    user: {
      person: {
        firstname: 'Vincent',
        lastname: 'Corbee'
      }
    }
  },
  computed: {
    fullName(): string {
      return `${this.user.person.firstname} ${this.user.person.lastname}`
    },
  } as any,
})

export default app
