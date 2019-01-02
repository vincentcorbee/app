// Logic is added for lit-html
// DOMParser can not parse elements that can not be children of body
// Also does not work if template element is not available
const createTemplate = content =>
  typeof content.getTemplateElement === 'function'
    ? content.getTemplateElement()
    : new DOMParser()
        .parseFromString(`<template>${content}</template>`, 'text/html')
        .querySelector('template')
export default createTemplate
