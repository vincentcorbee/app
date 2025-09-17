import { defineComponent } from '@digitalbranch/app';

import css from './grid.css';
import template from './grid.html';

export type GridProps = {
  xs?: boolean | number;
  md?: boolean | number;
  lg?: boolean | number;
  sm?: boolean | number;
  container?: boolean;
  item?: boolean;
  spacing?: number;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'stretch' | 'center' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
  className?: string;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
};

export const uiGrid = defineComponent({
  css,
  template,
});
