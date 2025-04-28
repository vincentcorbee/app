export default `<div>
{{title}}
<div>
<input type="text" *bind:value="myValue" @input="onInput" />
{{myValue}}
</div>
</div>`
