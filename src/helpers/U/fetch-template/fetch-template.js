const fetchTemplate = async template => {
  try {
    const res = await fetch(template, {
      credentials: 'same-origin',
    })
    const text = await res.text()
    const DOM = new DOMParser().parseFromString(text, 'text/html')

    return DOM.querySelector('template') || DOM
  } catch (err) {
    return document.createElement('template')
  }
}

export default fetchTemplate
