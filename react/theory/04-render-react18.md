# A Simple ReactDOM Renderer and React 18 Rendering

## 1. The basic rendering process

A simplified renderer receives a React element object and a DOM container.

Its basic responsibilities are to:

1. Create the corresponding DOM element.
2. Apply its properties and styles.
3. Set its text content.
4. Insert the element into the root container.

For example, the core operations include:

```js
const element = document.createElement(reactElement.type);

Object.assign(element.style, props.style);

element.textContent = props.children;

root.append(element);
```

These lines illustrate parts of the rendering process. A complete implementation must handle different property types and nested child elements correctly; this is only a small example and not a full replacement for ReactDOM.

---

## 2. Why this is different from `React.createElement()`

The two functions have different responsibilities.

```text
React.createElement()
        |
        v
React Element Object
        |
        v
ReactDOM Renderer
        |
        v
Browser DOM
```

The element object describes the UI. The renderer turns that description into DOM output.

This separation is the main idea behind building a simplified renderer.

---

## 3. Rendering with React 18

The browser example uses React 18's root API.

First, the HTML contains a root container:

```html
<div id="root"></div>
```

Then, create the React elements:

```js
const element1 = React.createElement(
  "h1",
  {
    className: "element",
    id: "first",
    style: {
      fontSize: "30px",
      backgroundColor: "orange",
      color: "white"
    }
  },
  "Hello Coder Army"
);

const element2 = React.createElement(
  "h2",
  {
    className: "element",
    id: "second",
    style: {
      fontSize: "20px",
      backgroundColor: "pink",
      color: "green"
    }
  },
  "Strike is launched"
);
```

Nest them inside a `div`:

```js
const div = React.createElement(
  "div",
  null,
  element1,
  element2
);
```

Finally, render the element tree:

```js
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(div);
```

Here:

- `document.getElementById("root")` selects the actual DOM container.
- `ReactDOM.createRoot()` creates a React root for that container.
- `root.render(div)` renders the supplied React element tree.

The nested structure allows the `div` to contain the heading and subheading.

---

## 4. Why JSX matters

Nested `React.createElement()` calls can become difficult to read as the element tree grows.

JSX is introduced as a more convenient way to describe React elements. It makes the structure of nested UI easier to read than deeply nested function calls.

The main idea is simple: JSX improves how we write element trees, while React still needs to interpret and render them.

---

## Final revision

- Raw DOM manipulation requires explicit element creation and property assignment.
- A custom DOM helper reduces repeated code but still creates real DOM nodes.
- React's `createElement()` creates an element description.
- ReactDOM renders that description into the browser DOM.
- React and ReactDOM are separate because element descriptions and platform-specific rendering have different responsibilities.
- React 18 browser rendering uses `ReactDOM.createRoot()` followed by `root.render()`.
