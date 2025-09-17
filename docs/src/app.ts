import { createApp, routerLink, routerView } from '@digitalbranch/app'

import {
  scaffold,
  uiTopAppBarMedium,
  uiTopAppBarSmall,
  uiIcon,
  uiIconButton,
  uiRipple,
  uiOutlinedButton,
  uiNavigationDrawer,
  uiNavigationDrawerButton,
  uiPage,
  uiGrid,
  uiDivider,
  uiHeading,
  uiParagraph,
} from './ui'
import { router } from './routes'
import { main, syntaxHighlighting } from './components'

createApp({
  el: '#app',
  components: {
    routerLink,
    routerView,
    main,
    scaffold,
    uiTopAppBarMedium,
    uiTopAppBarSmall,
    uiIcon,
    uiIconButton,
    uiRipple,
    uiOutlinedButton,
    uiNavigationDrawer,
    uiNavigationDrawerButton,
    uiPage,
    uiGrid,
    uiDivider,
    uiHeading,
    uiParagraph,
    syntaxHighlighting,
  },
  router,
})
