export default /* html */ `
<ui-grid item container spacing="1" class="page-header">
  <ui-grid
    item
    container
    justifyContent="stretch"
    md="12"
    *bind:lg="image || video ? 6 : 12"
  >
    <ui-card>
      <ui-card-content>
        <slot name="title"></slot>
        <slot name="intro"></slot>
      </ui-card-content>
    </ui-card>
  </ui-grid>
  <ui-grid
    *if="image"
    item
    container
    justifyContent="stretch"
    md="12"
    lg="6"
    class="page-header__image"
    *bind:class="['page-header__image--align-' + alignImage]"
  >
    <ui-card style="{ backgroundImage: 'url(' + backgroundImage)'}">
      <ui-card-image *bind:src="image" />
    </ui-card>
  </ui-grid>

  <ui-grid
    *if="video"
    item
    container
    justifyContent="stretch"
    md="12"
    lg="6"
    class="page-header__video"
  >
    <ui-card>
      <video autoPlay loop muted>
        <source *bind:src="video" />
      </video>
    </ui-card>
  </ui-grid>
</ui-grid>
`
