# JSX and Babel in React

## 1. What is JSX?

JSX (JavaScript XML) is a syntax extension that lets us write HTML-like markup inside JavaScript.

```jsx
const element = (
  <h1 id="title" className="first">
    Hello Coder Army
  </h1>
);
```

JSX looks similar to HTML, but it is not plain HTML. It is syntax that must be transformed into JavaScript before the browser can execute it.

---

## 2. Why Babel is required

JavaScript does not natively understand JSX syntax. Babel transforms JSX into JavaScript function calls that React can use.

For example, this JSX:

```jsx
const element = (
  <h1 id="title" className="first">
    Hello Coder Army
  </h1>
);
```

is transformed by the classic JSX transformation into an equivalent expression:

```js
const element = React.createElement(
  "h1",
  {
    id: "title",
    className: "first"
  },
  "Hello Coder Army"
);
```

The resulting React element describes the heading, its properties, and its text.

### JSX conversion flow

```text
JSX
  |
  v
Babel transformation
  |
  v
React.createElement()
  |
  v
React element object
  |
  v
ReactDOM renders it into the real DOM
```

This shows the classic JSX transformation used in the setup discussed here.

---

## 3. `className` instead of `class`

In JSX, use `className` to specify a CSS class:

```jsx
<h1 id="title" className="first">
  Hello Coder Army
</h1>
```

This is because JSX follows React's property naming conventions rather than copying every HTML attribute name exactly.

---

## 4. Setting up Babel in the browser example

The example loads React, ReactDOM, Babel Standalone, and the application script:

```html
<script
  crossorigin
  src="https://unpkg.com/react@18/umd/react.development.js">
</script>

<script
  crossorigin
  src="https://unpkg.com/react-dom@18/umd/react-dom.development.js">
</script>

<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<script type="text/babel" src="./app.js"></script>
```

The `type="text/babel"` attribute tells Babel Standalone to transform the script so JSX can be used in `app.js`.

---

## Quick revision

- JSX lets us write HTML-like markup inside JavaScript.
- JSX is not directly understood by the JavaScript parser.
- Babel transforms JSX into JavaScript.
- In the classic JSX transformation, Babel generates `React.createElement()` calls.
- Use `className` instead of `class` in JSX.
