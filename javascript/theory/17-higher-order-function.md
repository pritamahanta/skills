# Higher-Order Functions and Functional Programming in JavaScript

## 1. What Is a Higher-Order Function?

A **higher-order function (HOF)** is a function that:

- accepts one or more functions as arguments
- returns a function
- or does both

```javascript
function x() {
  console.log("Hi");
}

function y(callback) {
  callback();
}

y(x); // Hi
```

Here:

- `x` is a callback because it is passed to another function.
- `y` is a higher-order function because it accepts a function.

Higher-order functions let us pass behavior as a value, making code reusable and flexible.

```text
Data      → values such as numbers or strings
Behavior  → functions that describe what to do
```

---

## 2. The Duplication Problem

Suppose we want to calculate the area of several circles.

$$\text{Area} = \pi r^2$$

```javascript
const radius = [1, 2, 3, 4];

function calculateArea(radius) {
  const output = [];

  for (let i = 0; i < radius.length; i++) {
    output.push(Math.PI * radius[i] * radius[i]);
  }

  return output;
}

console.log(calculateArea(radius));
```

Now suppose we also need circumference:

$$\text{Circumference} = 2\pi r$$

```javascript
function calculateCircumference(radius) {
  const output = [];

  for (let i = 0; i < radius.length; i++) {
    output.push(2 * Math.PI * radius[i]);
  }

  return output;
}
```

Both functions repeat the same iteration logic. Only the calculation changes.

This duplicates code and violates the **DRY (Don't Repeat Yourself)** principle.

---

## 3. Separate the Operation From the Iteration

A better design writes the iteration once and accepts the calculation as an argument.

```javascript
const radiusArr = [1, 2, 3, 4];

const area = function (radius) {
  return Math.PI * radius * radius;
};

const circumference = function (radius) {
  return 2 * Math.PI * radius;
};

const calculate = function (radiusArr, operation) {
  const output = [];

  for (let i = 0; i < radiusArr.length; i++) {
    output.push(operation(radiusArr[i]));
  }

  return output;
};

console.log(calculate(radiusArr, area));
console.log(calculate(radiusArr, circumference));
```

### How it works

1. `radiusArr` contains the input values.
2. `area` describes one area calculation.
3. `circumference` describes one circumference calculation.
4. `calculate` handles iteration.
5. `operation` is called for each radius.
6. The results are returned in a new array.

`calculate` is a higher-order function because it accepts `operation`, a function argument.

### Why this design is better

- **Reuse:** the loop is written once.
- **Separation of concerns:** iteration and calculation have different responsibilities.
- **Flexibility:** new operations can be supplied without changing the loop.

This is a core functional-programming idea: separate what should be done from how a collection is traversed.

---

## 4. `map()` Does This Already

JavaScript arrays provide the built-in `map()` method.

`map()` applies a callback to every element and returns a new array containing the results.

```javascript
const radiusArr = [1, 2, 3, 4];

const area = function (radius) {
  return Math.PI * radius * radius;
};

console.log(radiusArr.map(area));
```

This has the same purpose as:

```javascript
console.log(calculate(radiusArr, area));
```

Both apply `area` to each radius and return the calculated results.

You can also pass an anonymous function directly:

```javascript
const areas = radiusArr.map(function (radius) {
  return Math.PI * radius * radius;
});
```

---

## 5. A Simplified `map()` Polyfill

A **polyfill** is an implementation that provides functionality similar to an existing feature. The following custom method demonstrates the basic idea behind `map()`:

```javascript
Array.prototype.calculate = function (operation) {
  const output = [];

  for (let i = 0; i < this.length; i++) {
    output.push(operation(this[i]));
  }

  return output;
};

const radiusArr = [1, 2, 3, 4];

const area = function (radius) {
  return Math.PI * radius * radius;
};

console.log(radiusArr.calculate(area));
```

### Understanding the custom method

- `Array.prototype.calculate` makes `calculate()` available to array instances.
- `this` refers to the array on which the method is called.
- `operation` receives the current element.
- Each result is pushed into `output`.
- The new result array is returned.

```text
radiusArr.calculate(area)
        ↓
this → radiusArr
        ↓
operation → area
        ↓
area applied to each element
        ↓
new result array
```

This is only a simplified demonstration. The native `map()` method supports additional behavior, such as callback arguments and more complete handling of array semantics.

---

## 6. HOFs, Callbacks, and `map()`

These ideas are related:

```text
Higher-order function
        ↓
accepts a function
        ↓
function is used as a callback
        ↓
operation is applied to data
```

In this example:

```javascript
radiusArr.map(area);
```

- `map` is a higher-order function.
- `area` is the callback.
- each radius is the data passed to `area`.

---

## 7. Functional-Programming Perspective

Higher-order functions encourage reusable transformations:

```text
Input collection
      +
Operation function
      ↓
Output collection
```

Instead of creating a new loop for every operation, define small functions that describe individual operations and pass them to a reusable collection function.

This approach improves readability and reduces duplicated control-flow code.

---

## 8. Interview Questions

### What is a higher-order function?

A function that accepts another function, returns a function, or does both.

### What is a callback function?

A function passed to another function so that it can be invoked by the receiving function.

### Why use a higher-order function for the circle example?

It separates the shared iteration logic from the operation being performed, avoiding duplicated loops.

### What does `map()` return?

`map()` returns a new array containing the result of applying its callback to each element.

### Is `map()` a higher-order function?

Yes. It accepts a callback function as an argument.

### What is a polyfill?

A custom implementation that provides functionality similar to an existing language or platform feature.

### What does `this` refer to in the custom method?

For `radiusArr.calculate(area)`, `this` refers to `radiusArr`.

### What is the difference between a HOF and a callback?

The HOF is the function receiving or returning another function. The callback is the function passed to it.

---

## 9. Final Mental Model

```text
Data collection
      +
Operation function
      ↓
Higher-order function
      ↓
Operation applied to each item
      ↓
New result collection
```

### Key terms

```text
Higher-order function
→ accepts and/or returns functions

Callback
→ function passed to another function

map()
→ applies a callback to each array element
  and returns a new array

Polyfill
→ custom implementation of similar functionality

Array.prototype
→ object used to share methods with array instances

this
→ the array instance receiving the custom method
```

### Key takeaways

```text
1. Functions can be passed as values in JavaScript.
2. A higher-order function accepts or returns a function.
3. A callback is a function passed to another function.
4. Separating iteration from the operation avoids duplicate loops.
5. map() applies a callback to each element and returns a new array.
6. A custom prototype method can demonstrate the basic behavior of map().
7. In the custom method, this refers to the array that invokes it.
8. Higher-order functions support reusable and flexible functional-programming patterns.
```

> **Core rule:** Higher-order functions let us pass behavior into reusable functions. Separating the operation from the iteration avoids duplicate code and is the basic idea behind methods such as `map()`.
