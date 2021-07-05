const removeStyles = (node, excludes) => {
  const styles =
    (node.getAttribute('style') ? node.getAttribute('style').split(';') : []).filter(
      style => excludes.some(item => style.match(item))
    ) || null
  if (styles && styles.length > 0) {
    node.setAttribute('style', styles.join(';'))
  } else {
    node.removeAttribute('style')
  }
}

export default removeStyles
