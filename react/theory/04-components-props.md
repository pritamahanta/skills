# React Components and Props

## 1. What is a React component?

A function component is a JavaScript function that returns JSX.

```jsx
function App() {
  return (
    <h1>Hello Coder Army</h1>
  );
}
```

A component lets us define a piece of UI and reuse it by rendering the component.

Component names begin with a capital letter, such as `App`, `Header`, `Main`, and `Footer`.

---

## 2. Rendering a component

A component can be called directly like a normal JavaScript function:

```jsx
App("Gulshan");
```

However, the usual React approach is to render it using JSX:

```jsx
<App />
```

When React renders the component, it supplies the props object as the component's argument.

This is important because passing a string directly to a function is different from supplying props to a React component.

---

## 3. What are props?

Props (properties) are inputs passed to a component.

They allow a component to receive data from the place where it is used.

```jsx
function App(props) {
  return (
    <h1>
      Hello Coder Army {props.name} {props.age}
    </h1>
  );
}

const element = (
  <App name="Gulshan" age={30} />
);
```

Here:

- `name="Gulshan"` passes a string prop.
- `age={30}` passes the number `30` as a JavaScript expression.
- React supplies these props to `App` in an object.
- The component accesses them through `props.name` and `props.age`.

The rendered output is:

```text
Hello Coder Army Gulshan 30
```

---

## 4. Passing an object as a prop

Props can also contain objects.

```jsx
function Main({ user }) {
  return (
    <>
      <h2>Hi {user.name}</h2>
      <h2>We have this information about you</h2>
      <ul>
        <li>{user.age}</li>
        <li>{user.city}</li>
      </ul>
    </>
  );
}

const element = (
  <Main
    user={{
      name: "Rohit",
      age: 30,
      city: "Lahore"
    }}
  />
);
```

### Understanding the syntax

The component declaration:

```jsx
function Main({ user }) {
```

uses object destructuring to extract `user` from the props object.

The component then accesses the object's properties through `user.name`, `user.age`, and `user.city`.

When passing an object in JSX, the outer curly braces indicate a JavaScript expression, and the inner curly braces define the object.

---

## 5. Composing multiple components

A page can be divided into smaller components.

```jsx
function Header(props) {
  return (
    <h1>
      Hi {props.name} Welcome To Pakistan Election Commission
    </h1>
  );
}

function Main({ user }) {
  return (
    <>
      <h2>Hi {user.name}</h2>
      <h2>We have this information about you</h2>
      <ul>
        <li>{user.age}</li>
        <li>{user.city}</li>
      </ul>
    </>
  );
}

function Footer() {
  return (
    <h3>Thanks For Visiting Our Website.</h3>
  );
}

function App() {
  return (
    <>
      <Header name="Gulshan" />

      <Main
        user={{
          name: "Rohit",
          age: 30,
          city: "Lahore"
        }}
      />

      <Footer />
    </>
  );
}
```

Here:

- `Header` receives a name.
- `Main` receives a user object.
- `Footer` renders fixed text.
- `App` combines all three components.
- A fragment groups the components without adding another DOM element.

This demonstrates how a larger UI can be assembled from smaller components.

---

## 6. Rendering the application

The React 18 browser-rendering setup is:

```jsx
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(<App />);
```

- `document.getElementById("root")` selects the DOM container.
- `ReactDOM.createRoot()` creates a React root for that container.
- `root.render(<App />)` renders the `App` component.

---

## Quick revision

- A function component returns JSX.
- Component names begin with capital letters.
- `<App />` renders a component through React.
- Props pass data into components.
- Props are supplied to a component as an object.
- Props can contain strings, numbers, and objects.
- Destructuring can extract individual props.
- Components can be composed to build a larger UI.
- Fragments group multiple elements without adding a wrapper element.
