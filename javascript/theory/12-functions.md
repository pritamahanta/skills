# First-Class and Anonymous Functions in JavaScript

## 1. Function Statement (Declaration)

A **function statement**, also called a **function declaration**, defines a named function with the `function` keyword.

```javascript
function a() {
  console.log("Hello");
}

a(); // Hello
```

The function's name is `a`.

---

## 2. Function Expression

A **function expression** creates a function as a value and assigns it to a variable.

```javascript
var b = function () {
  console.log("Hello");
};

b(); // Hello
```

Here, `b` refers to the function value.

The distinction is about how the function is used:

```text
function a() {}          → function declaration
var b = function () {};  → function expression
```

---

## 3. Declaration vs Expression During Hoisting

```javascript
a();
b();

function a() {
  console.log("Hello A");
}

var b = function () {
  console.log("Hello B");
};
```

Output:

```text
Hello A
TypeError
```

During memory creation, the bindings are conceptually:

```text
a → function
b → undefined
```

The function declaration is available before its position in the source. The function expression is assigned to `b` only when execution reaches the assignment.

So:

```text
Function declaration
→ binding contains the function during setup

Function expression with var
→ binding initially contains undefined
→ function assigned during execution
```

Calling `b()` before its assignment attempts to call `undefined`, which causes a `TypeError`.

---

## 4. Anonymous Functions

An **anonymous function** is a function without a name.

```javascript
function () {
  console.log("Hello");
}
```

A standalone function declaration must have a name, so this form is invalid by itself. Anonymous functions are commonly used as values:

```javascript
var b = function () {
  console.log("Hello");
};
```

Here:

```text
Function expression → describes how the function is used
Anonymous function  → describes that it has no name
```

One function can be both an expression and anonymous.

---

## 5. Named Function Expressions

A **named function expression** gives the function its own internal name.

```javascript
var b = function xyz() {
  console.log("b called");
};

b();   // b called
xyz(); // ReferenceError
```

`b` is available in the surrounding scope. `xyz` is the function's internal name and is not normally available as a variable in the surrounding scope.

Conceptually:

```text
Outer Scope
└── b

Function's own name binding
└── xyz
```

The internal name can be useful for self-reference and clearer debugging, but the surrounding code calls the function through `b`.

---

## 6. Parameters and Arguments

These terms describe different parts of a function call.

```javascript
var b = function (param1, param2) {
  console.log(param1, param2);
};

b(arg1, arg2);
```

- **Parameters** are the identifiers in the function definition: `param1`, `param2`.
- **Arguments** are the values supplied during the call: `arg1`, `arg2`.

```text
Function definition → parameters
Function call       → arguments
```

---

## 7. Functions Are First-Class Values

JavaScript treats functions as **first-class values**. A function can be:

- stored in a variable
- passed as an argument
- returned from another function

This is why functions can move through a program like other values.

### Stored in a variable

```javascript
var greet = function () {
  console.log("Hello");
};
```

### Passed as an argument

```javascript
var run = function (fn) {
  fn();
};

function greet() {
  console.log("Hello");
}

run(greet);
```

The parameter `fn` receives the function `greet`.

An anonymous function can also be passed directly:

```javascript
run(function () {
  console.log("Hello");
});
```

### Returned from another function

```javascript
function createFunction() {
  return function () {
    console.log("Hello");
  };
}

var result = createFunction();
result(); // Hello
```

The returned function is itself a value.

---

## 8. First-Class Functions vs Higher-Order Functions

These concepts are related but not identical.

### First-class functions

A language feature that allows functions to be stored, passed, and returned as values.

### Higher-order functions

A function that accepts a function as an argument, returns a function, or both.

```javascript
function execute(fn) {
  fn();
}
```

`execute` is a higher-order function because it accepts a function. Its behavior is possible because JavaScript functions are first-class values.

```text
First-class functions → functions can be treated as values
Higher-order function  → function accepts and/or returns functions
```

---

## 9. Complete First-Class Function Example

```javascript
var calculate = function (operation) {
  return operation;
};

function add() {
  console.log("Addition");
}

var result = calculate(add);
result(); // Addition
```

The flow is:

```text
add
  ↓
passed to calculate
  ↓
operation receives add
  ↓
calculate returns operation
  ↓
result receives add
  ↓
result() calls add
```

This example demonstrates both passing and returning a function.

---

## 10. Common Mistakes

### Function statement and function expression are the same

They are different forms:

```javascript
function a() {}          // declaration
var a = function () {};  // expression
```

### An anonymous function can always stand alone

A standalone function declaration requires a name. Anonymous functions are normally used in an expression or passed as a value.

### A named function expression creates a surrounding variable with that name

```javascript
var b = function xyz() {};
```

The surrounding variable is `b`; `xyz` is the function's internal name.

### Parameters and arguments are identical

They are different:

```text
Parameters → definition
Arguments  → call
```

### First-class function means higher-order function

First-class functions are a language capability. A higher-order function is a function that uses that capability by accepting or returning functions.

---

## 11. Interview Questions

### What is a function statement?

A named function declaration using the `function` keyword:

```javascript
function a() {
  console.log("Hello");
}
```

### What is a function expression?

A function created as a value, often assigned to a variable:

```javascript
var b = function () {
  console.log("Hello");
};
```

### What is the main hoisting difference?

Function declarations are available during environment setup. A function expression assigned to a `var` starts with the variable set to `undefined` and receives the function only during execution.

### What is an anonymous function?

A function without a name, commonly used as a value or callback.

### What is a named function expression?

A function expression with an internal function name:

```javascript
var b = function xyz() {};
```

`xyz` is not normally available in the surrounding scope.

### What is the difference between parameters and arguments?

Parameters are identifiers in the function definition. Arguments are values passed during the function call.

### What are first-class functions?

Functions that can be stored in variables, passed as arguments, and returned from other functions.

### What is a higher-order function?

A function that accepts a function, returns a function, or does both.

---

## 12. Final Mental Model

```text
                     FUNCTIONS
                         │
                         ▼
              First-Class Values
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Store           Pass          Return
       in variable    as argument   from function
```

### Function forms

```text
Function declaration
→ function a() {}

Function expression
→ var b = function () {}

Anonymous function
→ function with no name

Named function expression
→ var b = function xyz() {}
```

### Hoisting

```text
Function declaration
→ a → function during setup

Function expression with var
→ b → undefined during setup
→ b → function after assignment executes
```

### Key takeaways

```text
1. Function statement and function declaration mean the same thing.
2. A function expression treats a function as a value.
3. Function declarations are available during memory creation.
4. A var function expression starts with undefined until assignment.
5. An anonymous function has no name.
6. A named function expression has an internal name not normally available outside it.
7. Parameters belong to the definition; arguments belong to the call.
8. Functions are first-class values in JavaScript.
9. Functions can be stored, passed, and returned.
10. Higher-order functions accept and/or return functions.
```

> **Core rule:** JavaScript treats functions as first-class values, so they can be stored in variables, passed to other functions, and returned from functions. This capability supports callbacks, higher-order functions, and many JavaScript patterns.
