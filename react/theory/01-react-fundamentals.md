# React Fundamentals: From Manual DOM Updates to React Rendering

## 1. What is React?

React is a JavaScript library for building user interfaces (UIs).

Its purpose is to help developers describe and manage UI as application state changes, without manually handling every DOM update.

---

## 2. Imperative vs. declarative UI

### Manual DOM manipulation

JavaScript gives us the DOM API to create and modify HTML elements directly:

```js
const element = document.createElement("h1");

element.textContent = "Hello Coder Army";
element.className = "element";
element.id = "first";

element.style.fontSize = "30px";
element.style.backgroundColor = "orange";
element.style.color = "white";

document.getElementById("root").append(element);
```

This is an imperative approach because we explicitly describe the steps required to produce the desired UI:

1. Create an element.
2. Set its text.
3. Assign attributes and styles.
4. Insert it into the document.

### Why this becomes a problem

When we need several elements, each with different text, IDs, classes, and styles, we repeat the same kind of work again and again:

- Create each element.
- Set its properties.
- Apply styles.
- Insert it in the correct place.

This creates two main issues:

- Code duplication: similar DOM logic is repeated.
- UI synchronization: when state changes, the DOM must be kept in sync manually, which becomes difficult and error-prone.

### Imperative vs. declarative

| Imperative approach | Declarative approach |
|---|---|
| Describes how to change the UI step by step. | Describes what the UI should look like. |
| Requires explicit DOM manipulation. | React manages the necessary DOM updates. |
| Developers manually coordinate many UI changes. | The UI is described in terms of state. |

React encourages a declarative approach. Instead of manually writing every DOM operation, we describe the UI based on the current application state.

### The core idea: UI = f(state)

The mental model is:

$$
\text{UI} = f(\text{state})
$$

Where:

- UI = what the user sees.
- State = the data that determines what the UI should display.
- f = the logic that produces the UI from that state.

If state changes, the UI can change as well. For example, if a counter is `5`, the UI should show `5`; if it becomes `6`, the UI should show `6`.

React helps keep the rendered interface aligned with the current state instead of requiring manual DOM updates.

---

## 3. Repeated DOM work and a reusable function

A custom helper function can reduce duplication.

```js
function createElement(tag, attributes, children) {
  const element = document.createElement(tag);

  element.textContent = children;

  for (const key in attributes) {
    if (key === "style") {
      Object.assign(element.style, attributes.style);
    } else {
      element[key] = attributes[key];
    }
  }

  return element;
}
```

### What the arguments mean

- `tag`: the HTML element to create, such as `"h1"` or `"h2"`
- `attributes`: an object containing properties such as `className`, `id`, and `style`
- `children`: the text content inside the element

The function creates the DOM element, applies the given properties, and returns it.

### Why `Object.assign()` is used

Styles are provided as an object:

```js
{
  fontSize: "30px",
  backgroundColor: "orange",
  color: "white"
}
```

They must be copied onto the browser element's `style` object:

```js
Object.assign(element.style, attributes.style);
```

This works because styles are a collection of CSS properties, not one single ordinary property.

### Example usage

```js
const element1 = createElement(
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
```

This reduces repeated code because we only pass the parts that differ between elements.

### Important limitation

This helper still creates a real DOM node using `document.createElement()`.

It simplifies DOM manipulation, but it is not the same as React's `createElement()`.

React does not directly create browser DOM nodes. It creates an object that describes the element.

---

## 4. React element objects and ReactDOM

### What does `React.createElement()` return?

React's `createElement()` does not directly create an HTML DOM element. It creates a React element object that describes the element.

Example:

```js
const reactElement = {
  type: "h1",
  props: {
    className: "element",
    id: "first",
    style: {
      fontSize: "30px",
      backgroundColor: "orange",
      color: "white"
    },
    children: "Hello Coder Army"
  }
};
```

This object describes:

- `type`: which element should be rendered.
- `props`: the properties associated with that element.
- `props.children`: the content inside the element.

It is a JavaScript object, not a browser DOM element.

### A simplified React implementation

```js
const React = {
  createElement: function (type, props, children) {
    return {
      type: type,
      props: {
        ...props,
        children: children
      }
    };
  }
};
```

This returns an element description object. It does not call `document.createElement()` or directly modify the page.

### What is ReactDOM responsible for?

Creating a React element object does not automatically display it in the browser.

ReactDOM is responsible for rendering React elements into the browser DOM.

| React | ReactDOM |
|---|---|
| Creates React element descriptions. | Renders React elements into the browser DOM. |
| Represents what should be rendered. | Handles rendering into the DOM. |
| Does not create a DOM node by itself. | Manages the browser DOM output. |

The difference is:

- React describes the UI.
- ReactDOM turns that description into real DOM output.

### Why are React and ReactDOM separate?

This separation allows React to describe UI independently from the rendering environment. The same element model can be used for different renderers, not just browser DOM.

This is part of the idea behind React being a UI library separate from platform-specific rendering.

---

## 5. A simple renderer and React 18 rendering

A simplified renderer receives a React element object and a DOM container.

Its responsibilities are to:

1. Create the corresponding DOM element.
2. Apply properties and styles.
3. Set text content.
4. Insert the element into the root container.

```js
const element = document.createElement(reactElement.type);

Object.assign(element.style, props.style);

element.textContent = props.children;

root.append(element);
```

This shows the rendering flow conceptually. A full implementation must handle more cases, including nested elements and different property types.

### React 18 browser rendering flow

The HTML root container:

```html
<div id="root"></div>
```

Create nested React elements:

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

Nest them in a parent `div`:

```js
const div = React.createElement(
  "div",
  null,
  element1,
  element2
);
```

Render it:

```js
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(div);
```

Here:

- `document.getElementById("root")` selects the actual DOM container.
- `ReactDOM.createRoot()` creates a React root for that container.
- `root.render(div)` renders the tree into the DOM.

### Why JSX matters

Nested `React.createElement()` calls can become hard to read as the element tree grows.

JSX provides a cleaner way to write the same structure. It improves readability, but React still interprets JSX and renders it through the DOM renderer.

---

## Final revision

- Raw DOM manipulation is an imperative approach.
- Repeating DOM operations leads to duplication and difficult UI synchronization.
- React promotes declarative UI based on state.
- A reusable helper reduces repeated code, but it still uses browser DOM APIs directly.
- React's `createElement()` creates an element description object.
- ReactDOM is responsible for converting that description into real DOM output.
- React 18 uses `ReactDOM.createRoot()` and `root.render()` to render the element tree.
- The core idea is: React describes the UI, and ReactDOM renders it.
