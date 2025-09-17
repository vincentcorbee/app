export default /* css */ `
:host {
  --ui-ripple-x: 50%;
  --ui-ripple-y: 50%;
  --ui-ripple-scale: 1;
  --ui-ripple-start-dimension: 10;
  --ui-ripple-pressed-opacity: var(--ui-sys-state-pressed-state-layer-opacity);
  --ui-ripple-hover-opacity: var(--ui-sys-state-hover-state-layer-opacity);
  --ui-ripple-pressed-color: var(--ui-sys-color-on-surface);
  --ui-ripple-hover-color: var(--ui-sys-color-on-surface);

  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  overflow: hidden;
  z-index: 0;
  border-radius: inherit;
  display: block;
  box-sizing: border-box;
}

.ui-sys-state-layer:before {
  --ui-sys-state-layer-color: var(--ui-sys-color-on-primary);
  --ui-sys-state-layer-opacity: 0;

  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-color: hsl(var(--ui-sys-state-layer-color), var(--ui-sys-state-layer-opacity));
  pointer-events: none;
  border-radius: inherit;
}

.ui-ripple {
  width: 100%;
  height: 100%;
  display: block;

  &:hover {
    &.ui-sys-state-layer:before {
      --ui-sys-state-layer-color: var(--ui-ripple-hover-color);
      --ui-sys-state-layer-opacity: var(--ui-ripple-hover-opacity);
    }
  }

  &:after {
    content: '';
    width: 1px;
    height: 1px;
    position: absolute;
    border-radius: 50%;
    left: var(--ui-ripple-x);
    top: var(--ui-ripple-y);
    background-color: hsl(var(--ui-ripple-pressed-color));
    opacity: 0;
    z-index: 0;
  }
}

.ui-ripple--is-active {
  &:after {
    left: var(--ui-ripple-x);
    top: var(--ui-ripple-y);
    animation: 225ms ui-ripple-animation ease-out forwards,
      75ms ui-ripple-opacity-animation forwards;
  }
}

.ui-ripple--is-deactive {
  &:after {
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    animation: 225ms ui-ripple-opacity-animation-deactive forwards;
  }
}
@keyframes ui-ripple-animation {
    from {
      width: calc(var(--ui-ripple-start-dimension) * 1px);
      height: calc(var(--ui-ripple-start-dimension) * 1px);
    }

    to {
      height: calc(var(--ui-ripple-dimension) * 1px);
      width: calc(var(--ui-ripple-dimension) * 1px);
      transform: translate(
        calc(var(--ui-ripple-dimension) / 2 * -1px),
        calc(var(--ui-ripple-dimension) / 2 * -1px)
      );
    }
  }

  @keyframes ui-ripple-opacity-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: var(--ui-ripple-pressed-opacity);
    }
  }

  @keyframes ui-ripple-opacity-animation-deactive {
    from {
      opacity: var(--ui-ripple-pressed-opacity);
    }

    to {
      opacity: 0;
    }
  }
`
