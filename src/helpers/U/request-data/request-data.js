import Request from '../request/request'
import loader from '../loader/loader'

class RequestData {
  loader = false

  constructor(obj) {
    for (const [prop, value] of Object.entries(obj)) {
      this[prop] = value
    }

    if (this.loader) {
      this.loader = loader(this.loader)

      this.loader.add()
    }

    new Request().send(this)
  }
}

export default RequestData
