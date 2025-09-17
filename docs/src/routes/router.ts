import { Router } from '@digitalbranch/app'
import {
  formsPage,
  gettingStartedPage,
  homePage,
  propsPage,
  providersPage,
} from '../pages'

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
  },
  {
    path: '/providers',
    component: providersPage,
  }
)
