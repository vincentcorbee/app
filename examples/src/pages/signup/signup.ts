import App from '@App'
import Router from '@App/modules/Router'

import { signupPage, loginPage } from './pages'
import { AppConfig } from './types'
import { uiButton, uiModal } from './ui'

import './signup.css'

const router = new Router()

router.set(
  {
    uri: '/signup',
    component: signupPage,
  },
  {
    uri: '/login',
    component: loginPage,
  }
)

const app = new App({
  el: '#app',
  router,
  components: {
    uiModal,
    uiButton,
  },
} as AppConfig)

export default app
