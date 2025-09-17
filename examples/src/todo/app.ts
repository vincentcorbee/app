import { createApp } from '@digitalbranch/app'

import main from './main/main'
import { uiButton } from './ui'

const app = createApp({
  el: '#app',
  components: {
    main,
    uiButton,
  },
  data() {
    return {
      title: 'My Todo app',
    }
  },
})

export default app
