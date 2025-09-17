import { createApp, defineComponent } from '@digitalbranch/app'

import template from './providers.page.html'
import css from './providers.page.css'

class MyService {
  fetchData() {
    return Promise.resolve({ data: 'Oh yeah' })
  }
}

export const providersPage = defineComponent({
  name: 'providers-page',
  template,
  css,
  listeners: {
    ready() {
      const myService = new MyService()
      const myComponent = defineComponent({
        name: 'my-component',
        inject: ['myService'],
        template: `
          <div>
            <span *if="result">Say what? {{result}}</span>
          </div>`,
        data() {
          return {
            result: null,
          }
        },
        listeners: {
          async ready() {
            const result = await this.myService.fetchData()

            this.result = result.data
          },
        },
      })

      createApp({
        el: this.$node.shadowRoot?.querySelector('#root'),
        provide: {
          myService,
        },
        components: {
          myComponent,
        },
      })
    },
  },
})
