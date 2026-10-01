# Hoisting in JavaScript

## 1. What Is Hoisting?

A common explanation is:

> JavaScript moves declarations to the top.

That is a useful intuition, but it is **not the actual mechanism** being demonstrated.

A better mental model is that JavaScript creates an **execution context** and allocates memory for declarations before executing the code. Because of this, some variables and functions can be accessed before the line where they appear in the source code is executed.

```text
JavaScript program
       ↓
Execution context created
       ↓
Memory Creation Phase
       ↓
Memory allocated to variables/functions
       ↓
Code Execution Phase
```

## 2. Example: A Variable Before Its Declaration

Consider:

```js
console.log(x);

var x = 7;
```

You might expect a `ReferenceError`, but with `var`, the result is:

```text
undefined
```

During the Memory Creation Phase, JavaScript has already allocated memory for `x`:

```text
x → undefined
```

Then, during code execution:

```js
x = 7;
```

changes the value:

```text
x → 7
```

When `console.log(x)` executes, the current value is still `undefined` because the assignment has not happened yet.

## 3. A Function Declaration Before Its Definition

Consider:

```js
getName();

function getName() {
  console.log("Namaste JavaScript");
}
```

This works and outputs:

```text
Namaste JavaScript
```

During the Memory Creation Phase, JavaScript allocates memory for `getName` and stores the **function itself**, rather than `undefined`.

Conceptually:

```text
Memory

x       → undefined
getName → function code
```

Therefore, when execution reaches `getName()`, the function is already available.

## 4. Variable Hoisting vs. Function Hoisting

This distinction is important.

### `var`

```js
console.log(x);

var x = 7;
```

Memory:

```text
x → undefined
```

Result:

```text
undefined
```

### Function declaration

```js
getName();

function getName() {
  console.log("Namaste JavaScript");
}
```

Memory:

```text
getName → function code
```

Result:

```text
Namaste JavaScript
```

The difference is:

```text
var declaration
      ↓
memory → undefined

function declaration
      ↓
memory → actual function
```

This is why function declarations can be invoked before their textual position in the program.

## 5. `undefined` vs. `not defined`

This is one of the most important distinctions in the lesson.

### `undefined`

```js
console.log(x);

var x = 7;
```

Here, `x` exists in the execution context's memory, but its value has not yet been assigned:

```text
x → undefined
```

Therefore:

```text
console.log(x)
       ↓
   undefined
```

### `not defined`

Now remove the declaration completely:

```js
console.log(x);
```

There is no `var x` anywhere in the program, so JavaScript has not allocated memory for `x`.

The result is:

```text
ReferenceError: x is not defined
```

The distinction is:

```text
undefined
    =
The variable exists but currently has the value undefined.

not defined
    =
The identifier does not exist in the relevant environment.
```

The lesson demonstrates this distinction using the browser debugger.

## 6. `undefined` Is a Value

When:

```js
var x;
```

is processed during memory creation, the model is:

```text
x → undefined
```

So `undefined` is a JavaScript value.

For example:

```js
var x;

console.log(x);
```

outputs:

```text
undefined
```

But this:

```js
console.log(y);
```

when `y` was never declared, results in:

```text
ReferenceError: y is not defined
```

These are not the same situation.

## 7. What Happens Behind the Scenes?

Suppose:

```js
console.log(x);

var x = 7;

function getName() {
  console.log("Namaste JavaScript");
}

getName();
```

### Memory Creation Phase

Before execution starts, JavaScript encounters the declarations and creates memory conceptually like this:

```text
Global memory
────────────────────
x       → undefined
getName → function code
```

Only after this phase does code execution begin.

### Code Execution Phase

First:

```js
console.log(x);
```

The current value is `undefined`.

Then:

```js
x = 7;
```

Memory changes:

```text
x → 7
```

Finally:

```js
getName();
```

JavaScript finds the function in memory and executes it.

## 8. Why Does a Function Declaration Behave Differently?

Consider:

```js
function getName() {
  console.log("Namaste JavaScript");
}
```

This is a **function declaration**.

During memory creation:

```text
getName → function
```

The function is therefore available before the Code Execution Phase reaches its declaration.

This differs from function expressions and arrow functions.

## 9. Arrow Functions

Consider:

```js
getName();

var getName = () => {
  console.log("Namaste JavaScript");
};
```

This does not behave like a function declaration.

During memory creation, `getName` behaves like a variable:

```text
getName → undefined
```

When `getName()` executes, JavaScript is effectively trying to call:

```text
undefined()
```

This produces:

```text
TypeError: getName is not a function
```

The important concept is:

```text
Arrow function assigned to a variable
            ↓
Treated like a variable during creation
            ↓
Initially undefined
```

## 10. Function Expressions

The same idea applies to:

```js
getName();

var getName = function () {
  console.log("Namaste JavaScript");
};
```

During memory creation:

```text
getName → undefined
```

It is not stored as a fully available function declaration. Therefore, calling `getName()` before the assignment executes results in:

```text
TypeError: getName is not a function
```

## 11. Three Cases to Distinguish

### Function declaration

```js
getName();

function getName() {
  console.log("Hello");
}
```

Works because:

```text
getName → function
```

### Function expression with `var`

```js
getName();

var getName = function () {
  console.log("Hello");
};
```

Does not work because:

```text
getName → undefined
```

Result:

```text
TypeError: getName is not a function
```

### Arrow function with `var`

```js
getName();

var getName = () => {
  console.log("Hello");
};
```

This also behaves like a variable:

```text
getName → undefined
```

Result:

```text
TypeError: getName is not a function
```

## 12. Hoisting and the Execution Context

This is the connection to the previous lessons.

When JavaScript starts:

```text
Global Execution Context
        ↓
Memory Creation Phase
        ↓
Code Execution Phase
```

During memory creation:

```js
var x = 7;

function getName() {}
```

is conceptually represented as:

```text
x       → undefined
getName → function
```

Then during execution:

```text
x       → 7
getName → function
```

Hoisting is best understood through how declarations are initialized during execution-context creation, rather than by imagining JavaScript literally moving source code around.

## 13. Call Stack Demonstration

The latter part of the lesson revisits the Call Stack using the browser debugger.

When JavaScript starts, the Global Execution Context is created and pushed onto the Call Stack:

```text
Call Stack
──────────
Global EC
```

When a function is called:

```js
getName();
```

a new execution context is created and pushed onto the stack:

```text
Call Stack
──────────
getName EC
Global EC
```

The function executes. When it finishes, its context is removed:

```text
Call Stack
──────────
Global EC
```

After the entire program finishes, the Call Stack becomes empty.

## 14. Execution Flow of a Function Call

```text
getName()
    ↓
New Execution Context
    ↓
Push onto Call Stack
    ↓
Function executes
    ↓
Function finishes
    ↓
Execution Context removed
    ↓
Control returns to previous context
```

This connects hoisting to the execution-context and Call Stack concepts from the previous lesson.

## 15. Browser Debugger Demonstration

The browser's developer tools show that memory has already been allocated **before the first line of code executes**.

For example, before:

```js
var x = 7;
```

has executed, the debugger can show conceptually:

```text
x → undefined
```

Likewise, a function declaration is already available in memory. This demonstrates why hoisting works.

## 16. The Correct Interview Explanation of Hoisting

Avoid saying only:

> JavaScript moves variables and functions to the top.

A better explanation is:

> Hoisting is the behavior resulting from JavaScript creating an execution context and allocating memory for declarations before executing the code. In the case of `var`, the variable is initialized to `undefined`, while a function declaration is made available as a function during the creation phase. Therefore, some declarations can be accessed before their textual position in the code.

This explanation is based on execution-context creation and memory allocation rather than literal source-code movement.

## 17. Important Code Examples

### Example 1: `var` before assignment

```js
console.log(x);

var x = 7;
```

Output:

```text
undefined
```

Reason:

```text
Memory Creation:
x → undefined

Execution:
console.log(x) → undefined
x = 7
```

### Example 2: Function declaration before definition

```js
getName();

function getName() {
  console.log("Namaste JavaScript");
}
```

Output:

```text
Namaste JavaScript
```

Reason:

```text
Memory Creation:
getName → function
```

### Example 3: Before and after assignment

```js
console.log(x);

var x = 7;

console.log(x);
```

Output:

```text
undefined
7
```

The first `console.log()` runs before assignment, while the second runs after assignment.

### Example 4: Function expression before assignment

```js
getName();

var getName = function () {
  console.log("Namaste JavaScript");
};
```

Result:

```text
TypeError: getName is not a function
```

because:

```text
getName → undefined
```

during memory creation.

### Example 5: Arrow function before assignment

```js
getName();

var getName = () => {
  console.log("Namaste JavaScript");
};
```

Result:

```text
TypeError: getName is not a function
```

The core reason is the same: the variable holding the function is initially `undefined`.

## 18. Quick Comparison

| Code | Memory creation | Before assignment |
| --- | --- | --- |
| `var x = 10` | `x → undefined` | `undefined` |
| `function f() {}` | `f → function` | Function available |
| `var f = function() {}` | `f → undefined` | Not callable |
| `var f = () => {}` | `f → undefined` | Not callable |

## 19. Common Mistakes

### Mistake 1: Hoisting physically moves code

Do not imagine:

```js
console.log(x);
var x = 7;
```

becoming literal source-code rewriting such as:

```js
var x;
console.log(x);
x = 7;
```

Use the execution-context and memory-allocation model instead.

### Mistake 2: `undefined` means the variable does not exist

This is wrong:

```text
undefined
→ variable exists and currently has value undefined
```

Whereas:

```text
not defined
→ identifier was not available
```

### Mistake 3: All functions are hoisted identically

A function declaration and a function stored in a variable do not behave the same way in the model demonstrated:

```js
function f() {}
```

versus:

```js
var f = function () {};
```

versus:

```js
var f = () => {};
```

The first is available as a function during creation; the latter two behave like variables in this model.

## 20. What You Should Memorize

```text
HOISTING
   ↓
Execution Context Creation
   ↓
Memory Creation Phase
   ↓
Declarations receive memory
   │
   ├── var
   │     ↓
   │   undefined
   │
   └── function declaration
         ↓
       function code
```

Also remember:

```text
undefined
    ≠
not defined
```

And:

```text
function declaration
    ≠
function expression
    ≠
arrow function
```

## 21. Interview Questions

### What is hoisting?

Hoisting refers to JavaScript's behavior of making declarations available during execution-context creation before normal code execution takes place.

### Why can we access a `var` variable before its declaration?

Because memory for the variable is allocated during the Memory Creation Phase and initialized to `undefined`.

### Why can a function declaration be called before it is written?

Because the function declaration is made available in memory during execution-context creation.

### Why does calling a function expression before assignment fail?

Because the variable storing the function initially contains `undefined`, so it is not callable.

### What is the difference between `undefined` and `not defined`?

`undefined` means the variable exists but currently holds the value `undefined`. `not defined` means JavaScript cannot find the identifier.

### Is hoisting literally moving code to the top?

No. The deeper explanation is based on execution-context creation and memory allocation before code execution.

### Why does this work?

```js
getName();

function getName() {
  console.log("Hello");
}
```

Because the function declaration is available during the Memory Creation Phase.

### Why does this fail?

```js
getName();

var getName = function () {};
```

Because `getName` is initially `undefined`, and `undefined` is not callable.

## 22. Final Mental Model

When you see:

```js
console.log(x);

var x = 7;

function getName() {
  console.log("Hello");
}

getName();
```

think:

```text
                JavaScript starts
                       ↓
              Execution Context
                       ↓
              Memory Creation
                       ↓
          ┌────────────┴────────────┐
          │                         │
       x → undefined          getName → function
          │                         │
          └────────────┬────────────┘
                       ↓
                Code Execution
                       ↓
              console.log(x)
                       ↓
                  undefined
                       ↓
                   x = 7
                       ↓
               getName() works
```

### One-line summary

**Hoisting is best understood as the result of JavaScript allocating memory for declarations during execution-context creation before executing the code.**
