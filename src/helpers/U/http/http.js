import ajaxRequest from '../ajax-request/ajax-request'

const http = (() => {
  const request = (method, req) =>
    new Promise((resolve, reject) => {
      req.complete = function (err, res) {
        if (err) {
          reject(res, this)
        } else {
          resolve(res, this)
        }
      }
      req.method = method

      ajaxRequest(req)
    })
  return {
    get: req => request('GET', req),
    post: req => request('POST', req),
    put: req => request('PUT', req),
    delete: req => request('DELETE', req),
  }
})()

export default http
