# Functions, Execution Contexts, and Variable Environments

## 1. Core idea

Calling a function creates a new **function execution context**. It provides the
function invocation with its own local bindings and executes its body.

In the teaching model used in this series:

```text
Execution context
├── Memory / variable environment
└── Code / thread of execution
```

The memory component contains bindings for variables and functions. The code
component runs statements in order.

## 2. One example

```js
var x = 1;

function a() {
  var x = 10;
  console.log(x);
}

function b() {
  var x = 100;
  console.log(x);
}

a();
b();
console.log(x);
```

Output:

```text
10
100
1
```

There are three separate bindings named `x`:

```text
Global context: x → 1
a() context:    x → 10
b() context:    x → 100
```

The name is the same, but each binding belongs to a different environment.
Declaring a local `x` does not overwrite the global `x`.

## 3. What happens during execution?

### Global setup

When the script starts, JavaScript creates the global execution context. During
the setup phase, the relevant bindings are conceptually:

```text
x → undefined
a → function
b → function
```

The `var x` assignment has not executed yet, so `x` is initially
`undefined`. The function declarations are available during setup. This is a
pedagogical model of initialization; it does not mean source code is physically
moved.

### Global code runs

The statement `var x = 1` assigns `1` to the global binding. The global context
then calls `a()`.

### `a()` runs

The call creates an `a()` execution context and places it on the call stack.
Its local `var x` is initialized to `undefined` during the function's setup
phase, then the assignment changes it to `10`. `console.log(x)` resolves the
local binding and prints `10`.

When `a()` returns, its context is removed from the call stack and execution
continues in the global context.

### `b()` runs

`b()` follows the same process with a separate local binding. Its `x` becomes
`100`, so its log prints `100`. After it returns, the final `console.log(x)`
runs in the global context and prints the global value `1`.

The complete stack transition is:

```text
start:  Global
call a: a() → Global
return:  Global
call b: b() → Global
return:  Global
```

The top entry is the currently executing context.

## 4. The call stack

The **call stack** tracks active execution contexts in last-in, first-out
order:

```text
Call Stack while a() runs
┌─────────┐
│  a()    │  ← current context
├─────────┤
│ Global  │
└─────────┘
```

A function call pushes a context. Returning from the function pops it. Local
bindings belong to that invocation; a later call receives a new set of local
bindings.

For example, recursive or repeated calls do not share one `x` merely because
the function's source contains the same declaration. Each active invocation
has its own context.

## 5. How a variable reference is resolved

For a reference such as:

```js
function a() {
  var x = 10;
  console.log(x);
}
```

JavaScript first checks the current environment, so the local `x` is used.
When no local binding exists, JavaScript continues through the lexical
environment chain. That lookup rule is covered in
[Scope, Lexical Environment & Scope Chain](07-scope-chaining.md).

This distinction matters:

```js
var x = 1;

function changeLocal() {
  var x = 10; // declares a new local binding
}

function changeOuter() {
  x = 10; // no local x: resolves to an outer binding in non-module code
}
```

The two functions do not have the same effect. `changeLocal()` leaves the
global `x` unchanged. `changeOuter()` assigns through the resolved outer
binding in this example.

## 6. Local memory and variable environment

“Local memory” is a simplified name for the bindings associated with the
currently executing function context. “Variable environment” refers to the
memory component of an execution context in the terminology used by this
series.

These terms describe where bindings are associated; they do not imply that
JavaScript copies every outer value into each function. A function can access
outer bindings through its lexical environment chain.

## 7. Function declarations and expressions

The initialization timing depends on how a function is defined:

```js
sayHello(); // works

function sayHello() {
  console.log("hello");
}
```

A function declaration is available during the relevant setup phase. By
contrast:

```js
sayHello(); // TypeError: sayHello is not a function

var sayHello = function () {
  console.log("hello");
};
```

With `var`, the variable binding exists as `undefined` until execution reaches
the assignment. Calling it before then attempts to call `undefined`.

`let` and `const` have different initialization and temporal-dead-zone rules;
see [let, const & Temporal Dead Zone](08-let-const-temporal-dead-zone.md).

## 8. DevTools view

When execution is paused in DevTools, the Call Stack shows the active
contexts, and the Scope panel shows bindings available to the current frame.
While `a()` is paused, its local `x` and the global `x` can both be visible.
After `a()` returns, its frame is no longer active.

## 9. Common mistakes

### Same name means same variable

False. Scope and the binding's environment determine which variable a name
refers to.

### A function call permanently changes the caller's local variables

False for a local declaration such as `var x = 10`. That declaration creates a
binding in the called function's context. Assignment to an outer binding is a
different case.

### The function's position in the call stack determines its scope

False. Scope is determined by where code is defined (lexically), not by which
function calls it. The call stack tracks runtime execution; the lexical
environment chain controls name lookup.

## 10. Summary

```text
Function call
  → new execution context
  → local bindings for that invocation
  → context pushed onto the call stack
  → body executes
  → context popped when the function returns
```

The essential rule is:

> The same identifier can name different variables when those bindings belong
> to different environments.
