# Introduction to React: Manual DOM Manipulation

## 1. What is React?

React is a JavaScript library used to build user interfaces.

To understand why it is useful, it helps to look at how we create HTML elements with plain JavaScript.

---

## 2. Creating elements with the DOM API

JavaScript allows us to create and modify HTML elements directly.

```js
const element1 = document.createElement("h1");

element1.textContent = "Hello Coder Army";
element1.className = "element";
element1.id = "first";

element1.style.fontSize = "30px";
element1.style.backgroundColor = "orange";
element1.style.color = "white";

document.getElementById("root").append(element1);
```

This code manually creates an `h1`, sets its content, assigns properties and styles, and inserts it into the page.

Creating another element follows a similar pattern:

```js
const element2 = document.createElement("h2");

element2.textContent = "Strike is Launched";
element2.className = "element";
element2.id = "second";

element2.style.fontSize = "20px";
element2.style.backgroundColor = "pink";
element2.style.color = "green";

document.getElementById("root").append(element2);
```

---

## 3. The problem: repeated code

Both examples follow almost the same process:

1. Create an element.
2. Set its text.
3. Assign its attributes.
4. Apply styles.
5. Insert it into the DOM.

When many elements need to be created, repeating these operations makes the code long, repetitive, and harder to maintain.

The element-specific values are different, but much of the creation logic is the same.

---

## 4. The solution: a reusable function

We can move the repeated DOM-manipulation logic into a single function and pass the element-specific data as arguments.

This reduces duplication and makes element creation reusable.

The important idea is to separate:

- the common creation logic, and
- the values that change for each element.

---

## Key takeaway

Manual DOM manipulation gives direct control over each operation, but repeating the same process for many elements creates unnecessary code.

A reusable function is the first step toward simplifying this process.
