import { Router, createComponent, routerLink, routerView } from '@digitalbranch/app'

import { signupPage, loginPage, homePage } from './pages'
import { uiButton, uiModal } from './ui'

const router = new Router()

router.set(
  {
    path: '/',
    component: homePage,
  },
  {
    path: '/signup',
    component: signupPage,
  },
  {
    path: '/login',
    component: loginPage,
  }
)

createComponent({
  el: '#app',
  router,
  components: {
    routerLink,
    routerView,
    uiModal,
    uiButton,
  },
})
