import isType from './is-type/is-type'
import mix from './mix/mix'
import http from './http/http'
import append from './append/append'
import createNewElement from './create-new-element/create-new-element'
import copyArray from './copy-array/copy-array'
import copyObject from './copy-object/copy-object'
import { addListener, removeListener } from './event-listeners/event-listeners'
import fetchTemplate from './fetch-template/fetch-template'
import setZeroTimeout from './set-zero-timeout/set-zero-timeout'

window.setZeroTimeout = setZeroTimeout()

window.log = (msg, color) => {
  let data

  try {
    data = JSON.stringify(msg, null, 2)
  } catch (err) {
    data = msg
  }

  console.log(`%c${data}`, `background-color: ${color}; color: white; padding: 5px`)
}

export {
  append,
  createNewElement,
  copyArray,
  copyObject,
  isType,
  http,
  mix,
  addListener,
  removeListener,
  fetchTemplate,
}
