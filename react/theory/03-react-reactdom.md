# React Elements and ReactDOM

## 1. What does `React.createElement()` return?

React's `createElement()` does not directly create an HTML DOM element. It creates a React element object that describes the element.

A simplified example looks like this:

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

- `type`: which element should be rendered
- `props`: the properties associated with that element
- `props.children`: the content inside the element

It is a JavaScript object, not a browser DOM element.

---

## 2. A simplified React implementation

The idea can be illustrated with this implementation:

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

This function returns an object containing the element type and its properties.

Unlike the earlier custom DOM helper, it does not call `document.createElement()` or directly modify the page.

This is a simplified demonstration of React's element model, not React's full internal implementation.

---

## 3. What is ReactDOM responsible for?

Creating a React element object does not, by itself, display it in the browser.

ReactDOM is responsible for rendering React elements into the browser DOM.

Its job is to interpret the element description and produce the corresponding DOM output.

| React | ReactDOM |
|---|---|
| Creates React element descriptions. | Renders React elements into the browser DOM. |
| Represents what should be rendered. | Handles rendering into the DOM. |
| Does not create a DOM node merely by calling `createElement()`. | Manages the browser DOM output. |

---

## 4. Why are React and ReactDOM separate?

The idea is to separate the UI description from the platform-specific rendering process.

React's element model is not inherently tied to HTML DOM elements. Different renderers can use React's model to produce output for other environments.

The lecture discusses this distinction in the context of renderers for environments such as native interfaces and PDF output.

---

## Key takeaway

React describes the element. ReactDOM renders it into the browser DOM.

A React element object and a browser DOM element are two different things.
