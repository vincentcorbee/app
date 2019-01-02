const insertTemplate = (template, target) =>
  target.appendChild(template.content.cloneNode(true))
export default insertTemplate
