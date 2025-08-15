export const createTemplate = (content: string) =>
  new DOMParser()
    .parseFromString(`<template>${content}</template>`, 'text/html')
    .querySelector('template') as HTMLTemplateElement

export default createTemplate
