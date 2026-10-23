# JavaScript Quick Revision

Compact reminders for the concepts covered in this directory. Use the linked
theory notes when an explanation or example is needed.

## Foundations

- JavaScript executes code in execution contexts.
- An execution context has a memory/variable-environment component and a
  code/thread-of-execution component.
- JavaScript execution on one thread is single-threaded; synchronous code runs
  in order. Asynchronous APIs are coordinated by the host environment and the
  event loop.
- The call stack tracks active execution contexts in last-in, first-out order.
  A function call pushes a context; returning pops it.
- [Execution contexts](theory/01-js-working-execution-context.md)
- [Call stack](theory/02-code-execution-call-stack.md)

## Variables and initialization

- `var` is function-scoped, can be redeclared, and is initialized to
  `undefined` during its setup phase.
- `let` and `const` are block-scoped. Their bindings exist from the start of
  the block but cannot be accessed before initialization (the TDZ).
- `const` prevents reassignment of the binding; it does not make an object or
  array immutable.
- `undefined` is a value. `not defined` describes a missing binding and causes
  a `ReferenceError` when read.
- [Hoisting](theory/03-hoisting.md)
- [`let`, `const`, and TDZ](theory/08-let-const-temporal-dead-zone.md)
- [`undefined` vs. `not defined`](theory/06-undefined-vs-not-defined-few-more.md)

## Functions and scope

- Each function invocation gets its own local bindings.
- The same name in different environments can refer to different variables.
- Scope is lexical: it is determined by where code is written, not by who
  calls it.
- Name lookup checks the current environment, then follows the lexical
  environment chain outward.
- A closure is a function plus the lexical environment it retains access to.
- Function declarations are initialized during setup; a `var` function
  expression is `undefined` until its assignment executes.
- Functions are first-class values: they can be stored, passed, and returned.
- A higher-order function accepts a function, returns a function, or both.
- [Functions and variable environments](theory/04-functions-working-and-variable-management.md)
- [Scope chain](theory/07-scope-chaining.md)
- [Closures](theory/10-closures.md)
- [Higher-order functions](theory/17-higher-order-function.md)
- [Function forms](theory/12-functions.md)

## `this` and arrow functions

- In a regular function, `this` is determined by the call site (with strict
  mode and method-call rules affecting the result).
- `call`, `apply`, and `bind` explicitly control `this` for regular functions.
- Arrow functions do not create their own `this`; they capture it lexically.
- A method call such as `obj.method()` supplies `obj` as the receiver; storing
  the method separately can lose that receiver.
- [The `this` keyword](theory/24-this-keyword.md)

## Arrays and callbacks

- `map` transforms every element and returns a new array of equal length.
- `filter` keeps elements whose callback result is truthy.
- `reduce` combines elements into one accumulated result; provide an initial
  value when the accumulator needs a defined starting type or empty arrays
  must be handled safely.
- These methods do not mutate the source array unless the callback mutates
  referenced objects.
- [Array methods](theory/18-map-filter-reduce.md)
- [Callbacks](theory/13-callback-event-listners.md)

## Asynchronous JavaScript

- A callback is a function supplied to run later or by another function.
- The event loop coordinates the call stack with host queues; asynchronous
  completion does not interrupt currently running JavaScript.
- A Promise represents a future result: pending, fulfilled, or rejected.
- `.then()` returns a new Promise, which makes chaining possible. Return a
  value to fulfill the next step; return or throw an error to reject it.
- `.catch()` handles rejection from earlier steps in the chain.
- An `async` function always returns a Promise.
- `await` pauses that async function until the awaited Promise settles; it does
  not block the JavaScript thread.
- Use `try/catch` around `await` for rejection handling.
- `Promise.all` rejects when any input rejects; `Promise.allSettled` waits for
  every input; `Promise.race` settles with the first settled input;
  `Promise.any` fulfills with the first fulfillment and rejects only when all
  inputs reject.
- [Event loop](theory/14-async-js-event-loops.md)
- [Promises](theory/20-promises.md)
- [Promise creation and chaining](theory/21-promise-creation-chaining.md)
- [Promise APIs](theory/22-promise-apis.md)
- [Async/await](theory/23-async-await.md)

## Fast error checks

- `ReferenceError`: a binding cannot be found, or a lexical binding is read
  inside its TDZ.
- `TypeError`: a value has the wrong type for the operation, such as calling
  `undefined` or accessing a property on `null`.
- Before explaining output, identify the current scope, initialization state,
  call-stack frame, and whether a value is synchronous or asynchronous.
