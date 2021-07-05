import append from '../append/append'
import createNewElement from '../create-new-element/create-new-element'
import isType from '../is-type/is-type'
import getZindex from '../get-z-index/get-z-index'

class Loader {
  constructor(config = {}) {
    this.loader = null
    this.config = config
  }

  add() {
    const that = this
    const config = that.config
    const position = config.position === false ? false : config.position || {}
    const target = config.target
      ? isType('node', config.target)
        ? config.target
        : document.getElementById(config.target) || document.querySelector(config.node)
      : document.body
    const msg = config.message || null
    const div = createNewElement('div', [
      'class=loader',
      'style=z-index:' + getZindex() + ';display:inline-block;',
    ])
    const docFrag = createNewElement('documentFragment')

    if (msg) {
      append(div, createNewElement('span', ['innerHTML=' + msg]))
    }

    append(target, append(docFrag, div))

    const width = div.offsetWidth
    const height = div.offsetHeight
    const targetWidth = target ? target.offsetWidth : window.innerWidth
    const targetHeight = target ? target.offsetHeight : window.innerHeight

    if (config.position !== false) {
      div.style.top =
        position.top ||
        (((targetHeight / 2 - height / 2) / targetHeight) * 100 || 0) + '%'
      div.style.left =
        position.left && position.left !== 'center'
          ? position.left
          : (((targetWidth / 2 - width / 2) / targetWidth) * 100 || 0) + '%'
    }

    that.loader = div

    target.classList.add('loading')

    showHide(div, {
      action: 'show',
      style: 'fade',
      speed: config.dur,
    })
  }

  remove(cb) {
    const that = this
    const { config, loader } = that
    const target = loader.parentNode

    if (loader) {
      showHide(
        loader,
        {
          action: 'hide',
          style: 'fade',
          speed: config.dur,
        },
        () => {
          target.classList.remove('loading')

          if (target.contains(loader)) {
            target.removeChild(loader)
          }

          that.loader = null

          if (cb && typeof cb === 'function') {
            cb()
          }
        }
      )
    }
  }
}

const loader = config => {
  if (!config) {
    throw new Error('Configuration is not supplied')
  }

  return new Loader(config)
}

export default loader
