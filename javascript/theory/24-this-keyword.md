# The `this` Keyword in JavaScript

## 1. What is `this`?

In JavaScript, the value of `this` is determined by the execution context and, for regular functions, by how the function is called.

---

## 2. `this` in the global space

Anything defined in the global scope belongs to the global space.

```js
console.log(this);
```

In a browser's global script context, `this` refers to the global object, `window`. The global object can differ between JavaScript runtime environments.

---

## 3. `this` inside a regular function

The value of `this` inside a regular function depends on strict mode and the way the function is called.

```js
function x() {
  console.log(this);
}

x();
```

### Non-strict mode

When `x()` is called as a standalone function in non-strict mode, `this` refers to the global object in a browser.

### Strict mode

When strict mode is enabled, a standalone regular function call has `this` equal to `undefined`:

```js
"use strict";

function x() {
  console.log(this);
}

x();        // undefined
window.x(); // window
```

`x()` is a standalone function call, while `window.x()` is a method call through `window`. In the second call, `this` refers to `window`.

### This substitution

In non-strict mode, if `this` would otherwise be `null` or `undefined` in a regular function call, JavaScript substitutes the global object.

This explains why a standalone regular function call refers to the global object in non-strict mode but has `this` equal to `undefined` in strict mode.

> Global `this` and function `this` follow different rules.

---

## 4. `this` inside an object's method

When a regular function is called as an object's method, `this` refers to the object through which the method is called.

```js
const obj = {
  a: 10,

  x: function () {
    console.log(this);
    console.log(this.a);
  }
};

obj.x();
```

Output:

```text
{ a: 10, x: [Function: x] }
10
```

Because `x` is called as `obj.x()`, `this` refers to `obj`, so `this.a` evaluates to `10`.

---

## 5. `call()`, `apply()`, and `bind()`

These methods allow a function's `this` value to be controlled explicitly.

```js
const student = {
  name: "Alok",

  printName: function () {
    console.log(this.name);
  }
};

student.printName();
// Alok
```

Here, `this` refers to `student` because `printName()` is called as `student.printName()`.

A second object may have the same property without having the method:

```js
const student2 = {
  name: "Kajal"
};
```

Calling `student2.printName()` would fail because that method does not exist on `student2`. We can reuse `student`'s method with `call()`:

```js
student.printName.call(student2);
// Kajal
```

`call()` invokes `printName()` with `this` explicitly set to `student2`.

The example demonstrates `call()`. `apply()` and `bind()` are also methods for controlling a function's `this` value.

---

## 6. `this` inside an arrow function

Arrow functions do not have their own `this`. They inherit `this` from their enclosing lexical context.

### Arrow function directly inside an object

```js
const obj = {
  a: 10,

  x: () => {
    console.log(this);
  }
};

obj.x();
```

Calling the arrow function as `obj.x()` does not make `obj` the value of `this`. In a browser's global script context, the arrow function inherits the surrounding global `this`, which is `window`.

### Arrow function inside a regular method

```js
const obj2 = {
  a: 10,

  x: function () {
    const y = () => {
      console.log(this);
    };

    y();
  }
};

obj2.x();
```

The execution is:

1. `x` is a regular method called through `obj2.x()`, so `this` inside `x` refers to `obj2`.
2. The arrow function `y` inherits `this` from its enclosing function.
3. Therefore, `this` inside `y` also refers to `obj2`.

**Key difference:** A regular function gets `this` from its call site. An arrow function inherits `this` lexically.

---

## 7. `this` inside the DOM

In an inline HTML event handler, `this` refers to the HTML element associated with that handler.

```html
<button onclick="alert(this)">Click Me</button>
```

When the button is clicked, the alert displays the button element's string representation:

```text
[object HTMLButtonElement]
```

Here, `this` refers to the button element.

---

## Quick revision

| Context | Value of `this` |
|---|---|
| Browser global script context | `window` |
| Standalone regular function in non-strict mode | Global object |
| Standalone regular function in strict mode | `undefined` |
| Regular method called as `obj.method()` | The object before the dot, `obj` |
| Function invoked with `call(obj)` | Explicitly set to `obj` |
| Arrow function | Inherited from the enclosing lexical context |
| Inline DOM event handler | The associated HTML element |

## Core takeaway

For regular functions, determine `this` by looking at how the function is called. For arrow functions, remember that `this` is inherited from the surrounding lexical context rather than determined by the arrow function's own call site.
