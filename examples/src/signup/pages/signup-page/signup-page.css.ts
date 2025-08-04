export default /* css */ `
* {
  box-sizing: border-box;
}

:host {
  --color-error: #f44336;
  --color-blue: #3f51b5;
}

h1 {
  margin-top: 0;
}

.row:not(:last-child) {
  margin-bottom: var(--offset-md);
}

.fc-field {
  position: relative;
  display: inline-flex;
  height: 56px;
  background-color: #f5f5f5;
  --background-color-blue: #14cded;
}

.fc-field label {
  left: 16px;
  right: initial;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
  position: absolute;
  transform-origin: left top;
  line-height: 1.15rem;
  transition: transform 150ms;
}

.fc-field input {
  padding: 20px 16px 6px;
  font-size: 1rem;
  border: none;
  margin: 0;
  border-bottom: 1px solid;
  width: 100%;
  height: 100%;
  align-self: flex-end;
  box-sizing: border-box;
  background-color: transparent;
}

.fc-field input.fc-invalid {
  border-bottom-color: var(--color-error);
  color: var(--color-error);
}

.fc-field input.fc-invalid + label {
  color: var(--color-error);
}

.fc-field input:focus {
  outline: none;
}

.fc-field input:focus:not(.fc-invalid) {
  border-bottom: 1px solid var(--background-color-blue);
}

.fc-field input:focus + label,
.fc-field input:not(:placeholder-shown) + label {
  transform: translateY(-106%) scale(0.75);
}

.fc-radio {
  display: flex;
  align-items: center;
  margin: 8px 0;
  --fc-radio-border-color: rgba(0, 0, 0, 0.54);
}

.fc-radio-button {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fc-radio label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.fc-radio input {
  display: none;
}

.fc-radio-button-label {
  padding-left: 8px;
}

.fc-radio-button__outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--fc-radio-border-color);
  border-radius: 50%;
}

.fc-radio-button__inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
}

.fc-radio input:checked + .fc-radio-button .fc-radio-button__inner {
  background-color: var(--color-blue);
}

.fc-radio input:checked + .fc-radio-button .fc-radio-button__outer {
  border-color: var(--color-blue);
}

.fc-radio input.fc-invalid + .fc-radio-button .fc-radio-button__outer {
  border-color: var(--color-error);
}

.fc-error {
  color: var(--color-error);
  margin-top: 4px;
  font-size: 0.75rem;
}`
