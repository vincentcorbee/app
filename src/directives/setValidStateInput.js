const setValidStateInput = (valid, target) => {
  if (target.length) {
    for (const el of target) {
      setValidStateInput(valid, el)
    }
  } else {
    if (!valid && !target.classList.contains('fc-invalid')) {
      target.setAttribute('aria-invalid', 'true')
      target.classList.toggle('fc-invalid')
    } else if (valid && target.classList.contains('fc-invalid')) {
      target.setAttribute('aria-invalid', 'false')
      target.classList.toggle('fc-invalid')
    }
  }
}

export default setValidStateInput
