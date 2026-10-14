# Building a Reusable `createElement()` Function

## 1. Implement the function

We can create a function that accepts the tag name, attributes, and child content.

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

---

## 2. Understanding the arguments

- `tag`: the HTML element to create, such as `"h1"` or `"h2"`
- `attributes`: an object containing properties such as `className`, `id`, and `style`
- `children`: the text content to place inside the element

The function creates the DOM element, applies its content and properties, and returns the result.

This is a simplified implementation meant for basic elements and text content.

---

## 3. Why `Object.assign()` is used

Styles are passed as an object:

```js
{
  fontSize: "30px",
  backgroundColor: "orange",
  color: "white"
}
```

These properties must be applied to the element's `style` object:

```js
Object.assign(element.style, attributes.style);
```

`Object.assign()` copies the style properties into `element.style`.

The function handles styles separately because they are a collection of properties rather than a single ordinary element property.

---

## 4. Using the function

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

Instead of manually repeating every DOM operation, we provide only the information that changes between elements.

---

## 5. Important limitation

This custom function still creates a real DOM node using `document.createElement()`.

It simplifies DOM manipulation, but it is not yet the same as React's `createElement()`.

The next important step is to change what the function returns: instead of creating a browser DOM node, React creates an object that describes an element.

---

## Key takeaway

A custom function reduces repetitive DOM code. However, this example is still a DOM-manipulation helper; React's element-creation model works differently.
