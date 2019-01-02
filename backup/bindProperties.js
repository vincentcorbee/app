import getPlaceholders from './getPlaceholders'
import Property from '../models/Property'
import Mask from '../models/Mask'
import ArrayMask from '../models/ArrayMask'
import { U } from '../lib/U'
// This is all utterly shit
const mapPlaceholder = (placeholders, data, value, parent, key, node, vm) => {
  placeholders.forEach(placeholder => {
    if (`${parent}${key}` === placeholder.replace(/[{{ *}}]/g, '')) {
      if (!(value instanceof Property)) {
        data[key] = new Property({
          value: value,
          node: node,
          orgNode: node.cloneNode(true),
          identifier: `${parent}${key}`,
          vm: vm
        })
      } else {
        value.node = node
        value.identifier = `${parent}${key}`
      }
      node.data = node.data.split(placeholder).join(value.value || value)
      return false
    } else {
      return true
    }
  })
}
const match = (node, placeholders, data, vm, parent = '', element) => {
  /* if (typeof data === 'object') {
    const keys = Reflect.ownKeys(data).filter(key => key !== '__observable__')
    keys.forEach(key => {
      let value = data[key]
      if (value !== null && value !== undefined) {
        // console.log(`${parent}${key}.`, value)
        if (Array.isArray(value) || value instanceof ArrayMask) {
          let props = Reflect.ownKeys(value).filter(key => key !== '__observable__')
          props.forEach(prop => {
            // console.log(value[prop], prop)
            match(node, placeholders, value[prop], vm, `${parent}${key}.`, element)
          })
          // value.forEach(item =>
          //  match(node, placeholders, item, vm, `${parent}${key}.`, element)
          // ) 
        } else if (U.isType('object', value) && !(value instanceof Property)) {
          if (
            Object.getPrototypeOf(value) === Object.getPrototypeOf({}) ||
            value instanceof Mask
          ) {
            match(node, placeholders, value, vm, `${parent}${key}.`, element)
          }
        } else {
          mapPlaceholder(placeholders, data, value, parent, key, node, vm)
        }
      }
    }) */
  // } else {
  const getValue = (data, obj) => {
    let arr = obj.identifiers
    let placeholder = obj.placeholder
    let key = arr.shift() || null
    let value = key ? data[key] : null
    if (value && arr.length > 0) {
      obj.identifiers = arr
      return getValue(value, obj)
    } else {
      return {
        value,
        data,
        key,
        placeholder
      }
    }
  }
  placeholders.forEach(placeholder => {
    const obj = {
      placeholder,
      identifiers: placeholder
        .replace(/[{{ *}}]/g, '')
        .split('.')
        .map(entry => {
          let prop = entry.match(/\[[^\]*]\]/)
          prop = prop !== null ? prop[0] : null
          if (prop) {
            entry = entry.replace(prop, '')
            prop = prop.replace(/\[|\]/g, '')
            return [entry, prop]
          } else {
            return entry
          }
        })
        .reduce((acc, val) => acc.concat(val), [])
    }
    let res = getValue(data, obj)
    if (res) {
      if (res.value && !(res.value instanceof Property) && res.key !== 'length') {
        res.data[res.key] = new Property({
          value: res.value,
          node: node,
          orgNode: node.cloneNode(true),
          identifier: res.identifier,
          vm: vm
        })
      } else if (res.key !== 'length' && res.value) {
        res.value.node = node
        value.identifier = res.identifier
      }
      // console.log(data, parent)
      node.data = node.data.split(res.placeholder).join(res.value || '')
    }
    // console.log(res)
  })
  // }
}
const bindProperties = (node, data, vm, element) => {
  let placeholders = getPlaceholders(node)
  if (placeholders.length > 0) {
    match(node, placeholders, data, vm, '', element)
  }
}
export default bindProperties
