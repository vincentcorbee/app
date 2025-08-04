export default /* css */ `
:host {
  background-color: white;
  padding: 24px;
  border-radius: 10px;
  margin: 0 auto;
  max-width: 78rem;
  display: block;
  --color-error: #f44336;
  --color-blue: #3f51b5;
}

h1 {
  margin-top: 0;
}

.loader {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
}

.row:not(:last-child) {
  margin-bottom: var(--offset-md);
}

/* .fc-field {
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

.fc-error {
  color: var(--color-error);
  margin-top: 4px;
  font-size: 0.75rem;
} */

.flex {
  display: flex;
}

.flex-direction-column {
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}`
