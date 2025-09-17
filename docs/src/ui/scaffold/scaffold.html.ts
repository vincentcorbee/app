export default /* html */ `
<div class="ui-scaffold" *bind:class="{ 'ui-scaffold--has-top-app-bar-small': hasTopAppBar }">
  <div class="ui-scaffold__top-app-bar">
    <slot name="top-app-bar" @slotchange="onSlotChange"></slot>
  </div>

  <div class="ui-scaffold__navigation-drawer">
    <slot name="navigation-drawer"></slot>
  </div>

  <div class="ui-scaffold__content">
    <slot></slot>
  </div>

  <!--<div v-if="navigationRail" class="ui-scaffold__navigation-rail">
    <NavigationRail
      :fab="navigationRailFab"
      :menuButton="navigationRailMenuButton"
      :divider="navigationRail.divider"
      :items="navigationRail.items"
    />
  </div>

  <div *if="$slots.default" class="ui-scaffold__content">
    <slot />
  </div>

  <div *if="fab" class="ui-scaffold__fab">
    <Fab
      *if="fab.type === 'standard'"
      @onClick="fab.onClick"
    >
      <Icon *bind:icon="fab.icon" />
    </Fab>
    <ExtendedFab
      *else
      @onClick="fab.onClick"
    >
      <template #iconStart>
        <Icon *bind:icon="fab.icon" />
      </template>
      {{ fab.label }}
    </ExtendedFab>
  </div>

  <NavigationBar v-if="navigationBar" :items="navigationBar.items" /> -->
</div>
`
