export default /* html */ `
<h1 *if="type === 'h1'"><slot></slot></h1>
<h2 *if="type === 'h2'"><slot></slot></h2>
<h3 *if="type === 'h3'"><slot></slot></h3>
<h4 *if="type === 'h4'"><slot></slot></h4>
<h5 *if="type === 'h5'"><slot></slot></h5>
<h6 *if="type === 'h6'"><slot></slot></h6>
`
