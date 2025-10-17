export default /* html */ `
<ui-page>
  <ui-page-body>
    <page-header>
      <ui-heading type="h1" slot="title">Providers</ui-heading>

      <ui-paragraph slot="intro">
        Sometimes we want to define something and have all of our components have access to it.

        <br/><br/>
        Luckily we can achieve this via providers.
      </ui-paragraph>

    </page-header>

    <ui-page-content>

      <ui-heading type="h2">Our service</ui-heading>

      <ui-paragraph>
        Say we want to provide an api service to all the components in our application.

        <br/>
        <br/>

        Lets take the following hyper realistic service as an example.
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
/* Approximates 95.4% of all api's */

export class MyService {
  fetchData() {
    return Promise.resolve({ data: 'Oh yeah' });
  }
}
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Child component</ui-heading>


      <ui-paragraph>
        What we need now is a simple child component that consumes it.
      </ui-paragraph>

      <ui-heading type="h3">Template</ui-heading>

      <syntax-highlighting language="html">
        <textarea *skip>
<div>
  <span *if="result">Say what? {{result}}</span>
</div>
        </textarea>
      </syntax-highlighting>

      <ui-heading type="h3">Component</ui-heading>

      <syntax-highlighting language="js">
        <textarea>
import { defineComponent } from '@digitalbranch/app';

import template from './template.html';

export const myComponent defineComponent({
  name: 'my-component',
  inject: ['myService'],
  template,
  data() {
    return {
      result: null
    }
  },
  listeners: {
    async ready() {
      const result = await this.myService.fetchData();

      this.result = result.data;
    },
  },
});
        </textarea>
      </syntax-highlighting>

      <ui-paragraph>
        We inject the service by using the name of the key we used for providing the service.
      </ui-paragraph>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Application</ui-heading>

      <ui-paragraph>
        Now in our application we can provide it as follows.
      </ui-paragraph>

      <syntax-highlighting language="js">
        <textarea>
import { createApp } from '@digitalbranch/app';

import { MyService } from './services/my-service';
import { myComponent } from './components';

const myService = new MyService();

createApp({
  el: '#root',
  providers: {
    myService
  },
  components: {
    myComponent
  }
});
        </textarea>
      </syntax-highlighting>

      <ui-divider></ui-divider>

      <ui-heading type="h2">Result</ui-heading>

      <ui-paragraph>
        And voila. <span class="smiley">😎</span>
      </ui-paragraph>

      <div id="root" *skip>
        <my-component></my-component>
      </div>
    </ui-page-content>

  </ui-page-body>
</ui-page>
`
