export default /* css */ `
:host([container]){
  display: flex;
}

/*  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse' */
:host([container][direction="column"]){
  flex-wrap: nowrap;
  flex-direction: column;
}

:host([container][direction="row"]){
  flex-direction: row;
}

:host([container][direction="row-reverse"]){
  flex-direction: row-reverse;
}

:host([container][direction="column-reverse"]){
  flex-direction: column-reverse;
}

/* alignItems: 'flex-start' | 'flex-end' | 'stretch' | 'center' | 'baseline' */
:host([container][align-items="flex-start"]){
  align-items: flex-start;
}

:host([container][align-items="flex-end"]){
  align-items: flex-end;
}

:host([container][align-items="stretch"]){
  align-items: stretch;
}

:host([container][align-items="center"]){
  align-items: center;
}

:host([container][align-items="baseline"]){
  align-items: baseline;
}

/* justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' */
:host([container][justify-content="flex-start"]){
  justify-content: flex-start;
}

:host([container][justify-content="flex-end"]){
  justify-content: flex-end;
}

:host([container][justify-content="center"]){
  justify-content: center;
}

:host([container][justify-content="space-between"]){
  justify-content: space-between;
}

:host([container][justify-content="space-around"]){
  justify-content: space-around;
}

:host([container][justify-content="space-evenly"]){
  justify-content: space-evenly;
}

:host([container][justify-content="strech"]){
  justify-content: stretch;
}

/* flexWrap: 'wrap' | 'nowrap' | 'wrap-reverse' */
:host([container][flex-wrap="wrap"]){
  flex-wrap: wrap;
}

:host([container][flex-wrap="nowrap"]){
  flex-wrap: nowrap;
}

:host([container][flex-wrap="wrap-reverse"]){
  flex-wrap: wrap-reverse;
}

:host([spacing="1"]) {
  --ui-grid-spacing: calc(var(--ui-sys-unit) * 8);

  margin-left: calc(-1 * var(--ui-grid-spacing));
  margin-top: calc(-1 * var(--ui-grid-spacing));

  max-width: calc(100% + var(--ui-grid-spacing));
  max-height: calc(100% + var(--ui-grid-spacing));

  > ::slotted([item]) {
    padding-left: var(--ui-grid-spacing);
    padding-top: var(--ui-grid-spacing);
  }
}

:host([spacing="2"]) {
  --ui-grid-spacing: calc(var(--ui-sys-unit) * 16);

  margin-left: calc(-1 * var(--ui-grid-spacing));
  margin-top: calc(-1 * var(--ui-grid-spacing));

  max-width: calc(100% + var(--ui-grid-spacing));
  max-height: calc(100% + var(--ui-grid-spacing));

  > ::slotted([item]) {
    padding-left: var(--ui-grid-spacing);
    padding-top: var(--ui-grid-spacing);
  }
}

:host([spacing="3"]) {
  --ui-grid-spacing: calc(var(--ui-sys-unit) * 24);

  margin-left: calc(-1 * var(--ui-grid-spacing));
  margin-top: calc(-1 * var(--ui-grid-spacing));

  max-width: calc(100% + var(--ui-grid-spacing));
  max-height: calc(100% + var(--ui-grid-spacing));

  > ::slotted([item]) {
    padding-left: var(--ui-grid-spacing);
    padding-top: var(--ui-grid-spacing);
  }
}

:host([spacing="4"]) {
  --ui-grid-spacing: calc(var(--ui-sys-unit) * 32);

  margin-left: calc(-1 * var(--ui-grid-spacing));
  margin-top: calc(-1 * var(--ui-grid-spacing));

  max-width: calc(100% + var(--ui-grid-spacing));
  max-height: calc(100% + var(--ui-grid-spacing));

  > ::slotted([item]) {
    padding-left: var(--ui-grid-spacing);
    padding-top: var(--ui-grid-spacing);
  }
}

:host([item][xs]) {
  flex: 1 1 0;
  max-width: 100%;
}

:host([item][xs="1"]) {
  flex: 0 1 calc(1 / 12 * 100%);
  max-width: calc(1 / 12 * 100%);
}

:host([item][xs="2"]) {
  flex: 0 1 calc(2 / 12 * 100%);
  max-width: calc(2 / 12 * 100%);
}

:host([item][xs="3"]) {
  flex: 0 1 calc(3 / 12 * 100%);
  max-width: calc(3 / 12 * 100%);
}

:host([item][xs="4"]) {
  flex: 0 1 calc(4 / 12 * 100%);
  max-width: calc(4 / 12 * 100%);
}

:host([item][xs="5"]) {
  flex: 0 1 calc(5 / 12 * 100%);
  max-width: calc(5 / 12 * 100%);
}

:host([item][xs="6"]) {
  flex: 0 1 calc(6 / 12 * 100%);
  max-width: calc(6 / 12 * 100%);
}

:host([item][xs="7"]) {
  flex: 0 1 calc(7 / 12 * 100%);
  max-width: calc(7 / 12 * 100%);
}

:host([item][xs="8"]) {
  flex: 0 1 calc(8 / 12 * 100%);
  max-width: calc(8 / 12 * 100%);
}

:host([item][xs="9"]) {
  flex: 0 1 calc(9 / 12 * 100%);
  max-width: calc(9 / 12 * 100%);
}

:host([item][xs="10"]) {
  flex: 0 1 calc(10 / 12 * 100%);
  max-width: calc(10 / 12 * 100%);
}

:host([item][xs="11"]) {
  flex: 0 1 calc(11 / 12 * 100%);
  max-width: calc(11 / 12 * 100%);
}

:host([item][xs="12"]) {
  flex: 1 1 100%;
}

@media screen and (min-width: 600px) {
  :host([item][sm]) {
    flex: 1 1 0;
    max-width: 100%;
  }

  :host([item][sm="4"]) {
    flex: 0 1 calc(4 / 12 * 100%);
    max-width: calc(4 / 12 * 100%);
  }

  :host([item][sm="6"]) {
    flex: 0 1 50%;
    max-width: 50%;
  }
}

@media screen and (min-width: 900px) {
  :host([item][md]) {
    flex: 1 1 0;
    max-width: 100%;
  }

  :host([item][md="3"]) {
    flex: 0 1 calc(3 / 12 * 100%);
    max-width: calc(3 / 12 * 100%);
    min-width: calc(3 / 12 * 100%) ;
  }

  :host([item][md="4"]) {
    flex: 0 1 calc(4 / 12 * 100%);
    max-width: calc(4 / 12 * 100%);
    min-width: calc(4 / 12 * 100%);
  }

  :host([item][md="6"]) {
    flex: 0 1 50%;
    max-width: 50%;
  }

  :host([item][md="8"]) {
    flex: 0 1 calc(8 / 12 * 100%);
    max-width: calc(8 / 12 * 100%);
  }

  :host([item][md="9"]) {
    flex: 0 1 calc(9 / 12 * 100%);
    max-width: calc(9 / 12 * 100%);
  }

  :host([item][md="12"]) {
    flex: 0 1 100%;
    max-width: 100%;
  }
}

@media screen and (min-width: 1200px) {
  :host([item][lg]) {
    flex: 1 1 0;
    max-width: 100%;
  }

  :host([item][lg="6"]) {
    flex: 0 1 50%;
    max-width: 50%;
  }

  :host([item][lg="12"]) {
    flex: 0 1 100%;
    max-width: 100%;
  }
}`;
