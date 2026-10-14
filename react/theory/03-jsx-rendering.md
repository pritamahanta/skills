# JSX Expressions, Conditional Rendering, and Styling

## 1. Embedding JavaScript expressions

We can place JavaScript expressions inside JSX using curly braces `{}`.

```jsx
const age = 10;

const element = (
  <h1>
    Hello Coder {age > 10 ? "Adult" : "Kid"}
  </h1>
);
```

The expression evaluates to `"Kid"`, which becomes part of the rendered output.

---

## 2. Conditional rendering with a ternary operator

A conditional expression can choose what to display.

```jsx
const isLoggedIn = true;

const element = (
  <h1>
    Hello Coder{" "}
    {isLoggedIn
      ? <h2>Logged In</h2>
      : <h2>Kindly Sign In</h2>}
  </h1>
);
```

The condition determines which JSX branch is selected:

- If `isLoggedIn` is `true`, the first branch is rendered.
- Otherwise, the second branch is rendered.

---

## 3. What values can be rendered?

JavaScript expressions inside JSX can produce different kinds of output:

- Strings and numbers render as text.
- JSX elements can be nested inside other JSX.
- Arrays can render collections of values.
- Boolean values, `null`, and `undefined` do not produce visible child content.
- A plain JavaScript object cannot be rendered directly as a React child.

For example, an object may be passed as a prop, but placing a plain object directly between JSX tags is not valid child rendering.

---

## 4. Rendering arrays with `map()`

Suppose we have an array of courses:

```jsx
const courses = [
  "HTML",
  "CSS",
  "Javascript",
  "React"
];

const element = (
  <ul>
    {courses.map(course => <li>{course}</li>)}
  </ul>
);
```

`map()` transforms each course name into an `li` element and returns an array of those elements. JSX inserts that array inside the `ul`.

---

## 5. Inline styling in JSX

In JSX, inline styles are passed as a JavaScript object.

```jsx
const ab = {
  backgroundColor: "olive",
  color: "white"
};

const element = (
  <h1
    id="title"
    className="first"
    style={ab}
  >
    Hello Coder Army
  </h1>
);
```

Important details:

- The `style` value is a JavaScript expression, so it is placed inside `{}`.
- CSS property names use camelCase, such as `backgroundColor`.
- Style values are strings in this example.

---

## 6. Nested JSX and the single-root rule

Multiple sibling elements must be wrapped in a single parent element.

```jsx
const element = (
  <div>
    <h1>Hello</h1>
    <h2>Big Gamez PUCIT</h2>
  </div>
);
```

A fragment can also group elements without adding an extra DOM wrapper:

```jsx
const element = (
  <>
    <h1>Hello</h1>
    <h2>Big Gamez PUCIT</h2>
  </>
);
```

Fragments are useful when multiple elements need to be returned together without adding an unnecessary `div`.

---

## Quick revision

- Use `{}` to embed JavaScript expressions in JSX.
- A ternary expression can select which content to render.
- Arrays can render collections of elements.
- Plain objects cannot be rendered directly as children.
- Inline styles are provided through a style object.
- Nested JSX requires one enclosing element or a fragment.
