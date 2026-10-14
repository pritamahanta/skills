# React Fundamentals: Imperative vs. Declarative UI

## 1. What is React?

React is a JavaScript library for building user interfaces (UIs).

Its main purpose is to help developers describe and manage UI changes as an application state evolves, without manually updating the DOM for every single change.

---

## 2. The traditional approach: manual DOM manipulation

JavaScript gives us the DOM API, which lets us create and modify HTML elements directly.

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

This approach is called an imperative programming style because it explicitly describes the steps required to achieve the desired UI:

1. Create an HTML element.
2. Set its content.
3. Assign attributes, classes, and styles.
4. Insert the element into the page.

---

## 3. Why manual DOM updates become difficult

Imagine building several elements, each with different text, IDs, classes, and styles.

You would need to repeat the same kind of work again and again:

- Create each element.
- Set its properties.
- Apply styles.
- Insert it in the correct place.

This leads to two major problems:

### Code duplication
Similar DOM logic gets repeated for many elements.

### UI synchronization
When application data changes, the UI must also be updated correctly. With complex interfaces, manually tracking which elements need to change becomes difficult and error-prone.

---

## 4. Imperative vs. declarative programming

| Imperative approach | Declarative approach |
|---|---|
| Describes how to change the UI step by step. | Describes what the UI should look like. |
| Requires explicit DOM manipulation. | React handles the necessary DOM updates. |
| Developers manually coordinate many UI changes. | The UI is described in terms of application state. |

React encourages a declarative approach.

Instead of manually writing every DOM operation, we describe the UI that should appear based on the current application state.

---

## 5. The core principle: UI = f(state)

The central mental model is:

$$
\text{UI} = f(\text{state})
$$

Where:

- UI = what the user sees.
- State = the data that determines what the UI should display.
- f = the logic that produces the UI from that state.

Conceptually, if the state changes, the UI can change too.

For example, if a counter state is `5`, the UI should display `5`. When the state becomes `6`, the UI should display `6`.

React helps keep the rendered interface aligned with the current state instead of requiring developers to manually update every affected DOM element.

---

## Key takeaways

- React is a JavaScript library for building user interfaces.
- Manual DOM manipulation is an imperative approach.
- Repeating DOM operations leads to code duplication.
- Keeping a complex UI synchronized with changing data can easily introduce bugs.
- React promotes declarative UI development.
- The key mental model is: UI = f(state).
