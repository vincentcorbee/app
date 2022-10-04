interface AppConfig {
  el?: string
  data: any
  methods?: {
    [key: string]: (this: { [key: string]: any }, args?: any) => void
  }
  listeners?: {
    [key: string]: (this: { [key: string]: any }) => void
  }
}

interface Config extends AppConfig {
  data: () => {

  }
}

const loginPage = {
  name: 'loginPage',
  data() {
    return {
      title: 'Login',
    }
  },
  /*
    Load template with webpack dynamic imports.
    webpackMode "eager" addes html to the bundle in stead of a seperate chunk.
  */
  template: import(/* webpackMode: "eager" */ './login-page.template.html').then(({ default: template }) => template),
  methods: {
    onSubmit() {

    }
  }
} as Config

export default loginPage
