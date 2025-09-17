export default /* css */ `
:host {
  --color-default: 225, 227%, 231%;
  --color-tag-name: 170, 84%, 94%;
  --color-attribute_value: 212, 100%, 81%;
  --color-literal: 14, 91%, 70%;
  --color-string_literal: 42, 100%, 67%;
  --color-attribute_name: 86, 100%, 75%;
  --color-left_paren: 50, 100%, 50%;
  --color-right_paren: 50, 100%, 50%;
  --color-left_curly_brace: 50, 100%, 50%;
  --color-right_curly_brace: 50, 100%, 50%;
  --color-left_brack: 50, 100%, 50%;
  --color-right_brack: 50, 100%, 50%;
  --color-function_call: 221, 100%, 76%;
  --color-import: 354, 92%, 72%;
  --color-export: 354, 92%, 72%;
  --color-from: 354, 92%, 72%;
  --color-return: 354, 92%, 72%;
  --color-dot: 265, 69%, 75%;
  --color-colon: 265, 69%, 75%;
  --color-operator: 354, 92%, 72%;
  --color-this: 169, 65%, 68%;
  --color-member: 169, 100%, 84%;
  --color-const: 354, 92%, 72%;
  --color-quote: 129, 58%, 91%;
  --color-lt: 170, 63%, 68%;
  --color-gt: 170, 63%, 68%;

  --html-color-identifier: 86, 100%, 75%;
  --html-color-property-name: 221, 100%, 76%;
  --html-color-number: 14, 91%, 70%;
  --html-color-left_curly_brace: 50, 100%, 50%;
  --html-color-right_curly_brace: 50, 100%, 50%;
  --html-color-literal: 0, 100%, 71%;
  --html-color-left-paren: 50, 100%, 50%;
  --html-color-right-paren: 50, 100%, 50%;
  --html-color-class: 300, 100%, 76%;
  --html-color-pseudo-selector: 273, 100%, 73%;

  --font-size: 14px;
  --line-height: 1.5;
  --container-background-color: 0, 0%, 14%;
  --container-shape: 16px;
  --container-padding: 24px;

  --top-bar-padding-top: 8px;
  --top-bar-padding-bottom: 8px;

  display: block;
  background-color: hsl(var(--container-background-color));
  border-radius: var(--container-shape);
  position: relative;
  overflow: hidden;
  color: hsl(var(--color-default));
}

::slotted(textarea){
  display: none;
}

.top-bar {
  display: flex;
  background-color: hsl(0, 100%, 100%, 0.03);
  padding-top: var(--top-bar-padding-top);
  padding-bottom: var(--top-bar-padding-top);
  padding-right: var(--container-padding);
  padding-left: var(--container-padding);
}

.wrapper {
  overflow: auto;
  padding: var(--container-padding);
}

.copy {
  margin-left: auto;
}

.lang {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.copied {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  background-color: hsl(var(--container-background-color));
}

pre {
  counter-reset: line;
  margin: 0;
}

.line {
  counter-increment: line;
  font-size: var(--font-size);
  line-height: var(--line-height);
  min-height: calc(var(--font-size) * var(--line-height));
}

.line:before {
  // content: counter(line);
  user-select: none;
  // text-indent: -2em;
  display: inline-block;
}

.tag_name {
  color: hsl(var(--color-tag-name));
}
.attribute_name {
  color: hsl(var(--color-attribute_name));
}
.attribute_value {
  color: hsl(var(--color-attribute_value));
}
.lt, .lt + .div {
  color: hsl(var(--color-lt));
}
.gt, .tag_close {
  color: hsl(var(--color-gt));
}
.literal {
  color: hsl(var(--color-literal));
}
.string_literal {
  color: hsl(var(--color-string_literal));
}
.left_paren {
  color: hsl(var(--color-left_paren));
}
.right_paren {
  color: hsl(var(--color-right_paren));
}
.left_brack {
  color: hsl(var(--color-left_brack));
}
.right_brack {
  color: hsl(var(--color-left_brack));
}
.left_curl_brace {
  color: hsl(var(--color-left_curly_brace));
}
.right_curl_brace {
  color: hsl(var(--color-left_curly_brace));
}
.function_call {
  color: hsl(var(--color-function_call));
}
.import {
  color: hsl(var(--color-import));
  font-weight: bold;
}
.export {
  color: hsl(var(--color-export));
  font-weight: bold;
}
.const {
  color: hsl(var(--color-const));
  font-weight: bold;
}
.from {
  color: hsl(var(--color-from));
}
.return {
  color: hsl(var(--color-return));
}
.dot {
  color: hsl(var(--color-dot));
  font-weight: bold;
}
.colon {
  color: hsl(var(--color-colon));
  font-weight: bold;
}
.operator {
  color: hsl(var(--color-operator));
  font-weight: bold;
}
.this {
  color: hsl(var(--color-this));
  font-weight: bold;
}
.member {
  color: hsl(var(--color-member));
}
.quote {
  color: hsl(var(--color-quote));
}
.comment {
  opacity: 0.5;
}

.html_identifier {
  color: hsl(var(--html-color-identifier));
}
.html_property_name {
  color: hsl(var(--html-color-property-name));
}
.html_number {
  color: hsl(var(--html-color-number));
}
.html_left_curl_brace {
  color: hsl(var(--html-color-left_curly_brace));
}
.html_right_curl_brace {
  color: hsl(var(--html-color-left_curly_brace));
}
.html_literal {
  color: hsl(var(--html-color-literal));
}
.html_left_paren {
  color: hsl(var(--html-color-left-paren));
}
.html_right_paren {
  color: hsl(var(--html-color-right-paren));
}
.html_class {
  color: hsl(var(--html-color-class));
}
.html_pseudo_selector {
  color: hsl(var(--html-color-pseudo-selector));
}
`
