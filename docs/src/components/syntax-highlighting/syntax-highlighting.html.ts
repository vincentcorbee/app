export default /* html */ `
<div class="top-bar">
  <ui-icon-button title="Copy code" class="copy" @click="copy">
    <ui-icon *bind:icon="isCopied ? 'check_small' : 'content_copy'" fill="0"></ui-icon>
  </ui-icon-button>
  <span class="lang">{{ language }}</span>
</div>

<slot *ref="source" @slotchange="onSlotChange"></slot>

<div class="wrapper">
  <pre *ref="code"></pre>
</div>
`
