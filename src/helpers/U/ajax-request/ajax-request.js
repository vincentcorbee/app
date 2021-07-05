import RequestData from '../request-data/request-data'

const ajaxRequest = obj => {
  if (!obj) {
    throw new Error('Data is not supplied')
  }
  if (!obj.hasOwnProperty('callback') && typeof obj.callback === 'function') {
    throw new TypeError(obj.callback + ' is not a function')
  }

  return new RequestData(obj)
}

export default ajaxRequest
