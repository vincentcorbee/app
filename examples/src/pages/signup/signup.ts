import App from '@App'
import Router from '../../../../src/models/Router'
import signupPage from './signup-page/signup-page'
import loginPage from './login-page/login-page'
import uiModal from './ui/modal/modal'
import uiButton from './ui/button/button'

import './signup.css'

const router = new Router()

router.set({
  uri: '/signup',
  component: signupPage,
}, {
  uri: '/login',
  component: loginPage,
})

export interface AppConfig {
  el?: string
  data?: any
  router?: Router
  components?: any,
  methods?: {
    [key: string]: (this: { [key: string]: any }, args?: any) => void
  }
  listeners?: {
    [key: string]: (this: { [key: string]: any }) => void
  }
}

const app = new App({
  el: '#app',
  router,
  components: {
    uiModal,
    uiButton
  }
} as AppConfig)

export default app
