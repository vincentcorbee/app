/*
  Logic is added for lit-html
*/
const createTemplate = content =>
  typeof content.getTemplateElement === 'function'
    ? content.getTemplateElement()
    : new DOMParser()
        .parseFromString(`<template>${content}</template>`, 'text/html')
        .querySelector('template')

export default createTemplate
