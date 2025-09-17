import { defineComponent } from '@digitalbranch/app';

import template from './icon.html';
import css from './icon.css';

export const uiIcon = defineComponent({
  name: 'ui-icon',
  template,
  css,
  props: ['icon', 'fill'],
  data() {
    return {
      icon: '',
      fill: 1,
    };
  },
});
