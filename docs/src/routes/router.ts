import { Router } from '@digitalbranch/app'
import { formsPage, gettingStartedPage, homePage, propsPage } from '../pages'

export const router = new Router()

router.set(
  {
    path: '/',
    component: homePage,
  },
  {
    path: '/getting-started',
    component: gettingStartedPage,
  },
  {
    path: '/forms',
    component: formsPage,
  },
  {
    path: '/props',
    component: propsPage,
  }
)
