import { defineComponent } from '@digitalbranch/app'
import { getOffset } from '../utils'

import template from './ripple.html'
import css from './ripple.css'

export type RippleState = {
  center: boolean
  pressed: boolean
  animationActive: boolean
  animationDeactive: boolean
  animationActiveEnded: boolean
  rippleScale: number
  rippleDim: number
  pos: {
    x: number
    y: number
  }
}

export const uiRipple = defineComponent({
  template,
  css,
  props: [{ name: 'center', type: 'boolean' }],
  data(): RippleState {
    return {
      center: false,
      pressed: true,
      animationActive: false,
      animationDeactive: false,
      animationActiveEnded: false,
      rippleScale: 1,
      rippleDim: 0,
      pos: {
        x: 0,
        y: 0,
      },
    }
  },
  listeners: {
    ready() {
      const { clientWidth, clientHeight } = this.$refs.ripple as HTMLSpanElement
      const curSize = Math.max(clientWidth, clientHeight)

      this.rippleDim = Math.sqrt(Math.pow(curSize, 2) * 2)
      this.rippleScale = 1
      this.boundFunction = this.onMouseUp.bind(this)
    },
  },
  methods: {
    onMouseDown(e: MouseEvent) {
      const { button } = e
      const ripple = this.$refs.ripple as HTMLSpanElement

      this.animationActive = false

      if (ripple) {
        ripple.classList.remove('ui-ripple--is-active')

        const { clientWidth, clientHeight } = ripple
        const curSize = Math.max(clientWidth, clientHeight)
        const { top, left } = getOffset(ripple)
        const { x: pointerX, y: pointerY } = e
        const x = pointerX - left
        const y = pointerY - top
        const scale =
          2 - Math.min(Math.min(x, curSize - x), Math.min(y, curSize - y)) / (curSize / 2)

        this.rippleScale = scale
        this.rippleDim = Math.sqrt(Math.pow(curSize, 2) * 2) * scale
        this.pos.x = x
        this.pos.y = y
      }

      if (button === 0) {
        this.pressed = true
        this.animationDeactive = false
        this.animationActiveEnded = false
        this.animationActive = true

        window.addEventListener('mouseup', this.boundFunction)
      }
    },
    onMouseUp() {
      this.pressed = false

      if (this.animationActiveEnded) {
        this.animationDeactive = true
        this.animationActive = false
      }

      window.removeEventListener('mouseup', this.boundFunction)
    },
    onclick(e: MouseEvent) {},
    onAnimationStart(e: AnimationEvent) {
      if (e.animationName === 'ui-ripple-animation') {
        this.animationActiveEnded = false
      }
    },
    onAnimationEnd(e: AnimationEvent) {
      if (e.animationName === 'ui-ripple-animation' && this.animationActive) {
        this.animationActiveEnded = true

        if (!this.pressed) {
          this.animationActive = false
          this.animationDeactive = true

          this.$dispatchCustomEvent('deactive')
        }
      }

      if (e.animationName === 'ui-ripple-opacity-animation-deactive') {
        this.animationDeactive = false
      }
    },
  },
})
