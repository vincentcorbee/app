export interface Todo {
  id: number
  done: boolean
  text: string
}

const todoItem = {
  /*
    props is a list of attributes that the components watches for changes
  */
  props: ['todo'],
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" addes html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './todo-item.template.html').then(({ default: template }) => template),
}

export default todoItem