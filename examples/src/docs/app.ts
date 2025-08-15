import { createComponent } from '@digitalbranch/app'

import { main } from './components/main'

import {
  scaffold,
  uiTopAppBarMedium,
  uiTopAppBarSmall,
  uiIcon,
  uiIconButton,
  uiRipple,
  uiOutlinedButton,
} from './ui'

createComponent({
  el: '#app',
  components: {
    main,
    scaffold,
    uiTopAppBarMedium,
    uiTopAppBarSmall,
    uiIcon,
    uiIconButton,
    uiRipple,
    uiOutlinedButton,
  },
  listeners: {
    ready() {},
  },
})
