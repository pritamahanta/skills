# JavaScript: `call()`, `apply()`, and `bind()`

## 1. Why are these methods useful?

In JavaScript, the value of `this` depends on how a function is called.

```js
const user = {
  name: "Pritam",

  greet: function () {
    console.log(`Hello, ${this.name}`);
  }
};

user.greet();
// Hello, Pritam
```

Because the function is called as `user.greet()`, `this` refers to `user`.

A function can also be reused with different objects by explicitly choosing its `this` value:

```js
const user = {
  name: "Pritam"
};

const admin = {
  name: "Admin"
};

function greet() {
  console.log(`Hello, ${this.name}`);
}
```

`call()`, `apply()`, and `bind()` allow us to control `this` for regular functions.

---

## 2. `call()`

`call()` invokes a function immediately and sets its `this` value.

### Syntax

```js
functionName.call(thisArg, arg1, arg2, ...);
```

- `thisArg`: the value to use as `this`
- Remaining arguments: passed individually to the function

### Setting `this`

```js
const user = {
  name: "Pritam"
};

function greet() {
  console.log(`Hello, ${this.name}`);
}

greet.call(user);
// Hello, Pritam
```

`call(user)` invokes `greet` immediately with `this` set to `user`.

### Passing arguments

```js
function introduce(city, country) {
  console.log(`${this.name} lives in ${city}, ${country}`);
}

introduce.call(user, "Jalpaiguri", "India");
// Pritam lives in Jalpaiguri, India
```

The arguments are passed individually after `thisArg`.

### Method borrowing

Method borrowing means using a method belonging to one object with another object:

```js
const student1 = {
  name: "Pritam",

  printName: function () {
    console.log(this.name);
  }
};

const student2 = {
  name: "Rahul"
};

student1.printName();
// Pritam

student1.printName.call(student2);
// Rahul
```

The method is defined on `student1`, but `call(student2)` sets `this` to `student2` for that invocation.

---

## 3. `apply()`

`apply()` also invokes a function immediately and sets its `this` value. Its main difference from `call()` is the way arguments are supplied.

### Syntax

```js
functionName.apply(thisArg, [arg1, arg2, ...]);
```

The second argument is an array or array-like object containing the function arguments.

```js
function introduce(city, country) {
  console.log(`${this.name} lives in ${city}, ${country}`);
}

introduce.apply(user, ["Jalpaiguri", "India"]);
// Pritam lives in Jalpaiguri, India
```

These two calls produce the same result:

```js
introduce.call(user, "Jalpaiguri", "India");
introduce.apply(user, ["Jalpaiguri", "India"]);
```

### Using `apply()` with `Math.max()`

```js
const numbers = [10, 25, 5, 40, 15];

console.log(Math.max.apply(null, numbers));
// 40
```

`Math.max()` does not need a custom `this` value, so `null` is used as the `thisArg`. The array supplies its values as the function arguments.

In modern JavaScript, the spread operator is usually simpler:

```js
console.log(Math.max(...numbers));
// 40
```

---

## 4. `bind()`

Unlike `call()` and `apply()`, `bind()` does not invoke the function immediately. It returns a new function with a bound `this` value.

### Syntax

```js
const newFunction = functionName.bind(thisArg, arg1, arg2, ...);
```

- `thisArg`: the value to use as `this`
- Remaining arguments: optional arguments to pre-fill
- Return value: a new function

### Binding `this`

```js
const user = {
  name: "Pritam"
};

function greet() {
  console.log(`Hello, ${this.name}`);
}

const greetUser = greet.bind(user);
```

The `bind()` call creates `greetUser`; it does not execute `greet()`.

```js
greetUser();
// Hello, Pritam
```

When `greetUser()` is called, it uses the bound `this` value.

### Partial application

`bind()` can also pre-fill arguments:

```js
function introduce(city, country) {
  console.log(`${this.name} lives in ${city}, ${country}`);
}

const introduceUser = introduce.bind(user, "Jalpaiguri");

introduceUser("India");
// Pritam lives in Jalpaiguri, India
```

Here, `this` is bound to `user` and `city` is pre-filled with `"Jalpaiguri"`. The returned function only needs `country`.

This is called **partial application**: creating a function by fixing some of the original function's arguments in advance.

### Preserving `this` in a callback

Calling an object method directly preserves its receiver:

```js
const user = {
  name: "Pritam",

  greet: function () {
    console.log(`Hello, ${this.name}`);
  }
};

user.greet();
// Hello, Pritam
```

Passing the method as a callback separates it from the object:

```js
setTimeout(user.greet, 1000);
```

The timer invokes the function independently, so it does not automatically preserve `user` as `this`. The output may be `Hello, undefined`.

Bind the method before passing it as the callback:

```js
setTimeout(user.greet.bind(user), 1000);
```

The bound function retains the intended `this` value and prints `Hello, Pritam`.

---

## 5. Comparing `call()`, `apply()`, and `bind()`

| Feature | `call()` | `apply()` | `bind()` |
|---|---|---|---|
| Executes immediately? | Yes | Yes | No |
| Returns | The function's result | The function's result | A new function |
| Sets `this`? | Yes | Yes | Yes |
| Argument format | Individual arguments | Array or array-like object | Individual arguments, optionally pre-filled |
| Main use | Immediate invocation | Immediate invocation with an argument collection | Later invocation with a fixed `this` |

### All three together

```js
const person = {
  name: "Pritam"
};

function greet(city, country) {
  return `${this.name} lives in ${city}, ${country}`;
}

console.log(greet.call(person, "Jalpaiguri", "India"));
console.log(greet.apply(person, ["Jalpaiguri", "India"]));

const greetPerson = greet.bind(person, "Jalpaiguri");
console.log(greetPerson("India"));
```

Each call produces:

```text
Pritam lives in Jalpaiguri, India
```

---

## 6. Important rules and common mistakes

### Arrow functions cannot be rebound

Arrow functions do not have their own `this`; they inherit it from their surrounding lexical scope. Therefore, `call()`, `apply()`, and `bind()` cannot override an arrow function's `this`.

```js
const user = {
  name: "Pritam"
};

const greet = () => {
  console.log(this.name);
};

greet.call(user);
```

`call(user)` does not make `this` refer to `user` inside the arrow function.

### A bound function keeps its original binding

For a normally invoked bound function, another `call()`, `apply()`, or `bind()` does not replace the original `this` binding:

```js
const user1 = {
  name: "Pritam"
};

const user2 = {
  name: "Rahul"
};

function greet() {
  console.log(this.name);
}

const boundGreet = greet.bind(user1);

boundGreet();            // Pritam
boundGreet.call(user2);  // Pritam

const anotherGreet = boundGreet.bind(user2);
anotherGreet();          // Pritam
```

The original binding to `user1` is retained.

### `null` and `undefined` as `thisArg`

The behavior depends on strict mode:

```js
function showThis() {
  console.log(this);
}

showThis.call(null);
```

- In non-strict mode, `null` and `undefined` are substituted with the global object.
- In strict mode, the supplied value is preserved.
- In non-strict mode, primitive values are converted to corresponding wrapper objects; strict functions preserve the primitive value.

These conversions are generally not something application code should rely on.

---

## Practice questions

### Question 1: `call()`

```js
const obj = {
  value: 100
};

function display() {
  console.log(this.value);
}

display.call(obj);
```

Output:

```text
100
```

### Question 2: `apply()`

```js
function calculate(a, b, c) {
  return a + b + c;
}

const numbers = [10, 20, 30];

console.log(calculate.apply(null, numbers));
```

Output:

```text
60
```

### Question 3: `bind()`

```js
const obj = {
  value: 50
};

function add(num) {
  return this.value + num;
}

const addToValue = add.bind(obj, 20);

console.log(addToValue());
```

Output:

```text
70
```

### Question 4: Binding does not execute immediately

```js
function greet() {
  console.log("Hello");
}

const newGreet = greet.bind({});

console.log("Start");
newGreet();
console.log("End");
```

Output:

```text
Start
Hello
End
```

`bind()` creates the function; `newGreet()` executes it.

---

## When should you use each method?

- **`call()`**: invoke a function immediately with a particular `this` value and individual arguments.
- **`apply()`**: invoke a function immediately when its arguments are already in an array or array-like structure.
- **`bind()`**: create a function for later execution with a particular `this` value or pre-filled arguments.

## Core takeaway

`call()` and `apply()` invoke a function immediately, while `bind()` returns a new function for later use. `call()` receives individual arguments, `apply()` receives an argument array, and `bind()` can preserve `this` and pre-fill arguments.

## References

- [MDN: `Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN: `Function.prototype.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [MDN: `Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN: `this` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
