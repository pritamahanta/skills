# Closures in JavaScript

## 1. What Is a Closure?

A **closure** is a function together with the lexical environment it retains access to.

In simpler terms:

> A closure allows a function to remember and access variables from its surrounding scope, even when the function is used outside that scope.

```text
Function + lexical environment = closure
```

A function does not need to be returned for a closure to exist. Returning an inner function is simply one of the clearest ways to observe closure behavior.

---

## 2. Closures Begin With Lexical Scope

```javascript
function x() {
  var a = 7;

  function y() {
    console.log(a);
  }

  y();
}

x();
```

When `y()` looks for `a`, it searches its own environment first. Since `a` is not local to `y`, lookup continues through the lexical parent, `x`.

```text
y's environment
      ↓
a not found
      ↓
x's environment
      ↓
a = 7
```

Output:

```text
7
```

This is ordinary scope-chain lookup. The closure becomes especially visible when `y` is used after `x` has finished.

---

## 3. Returning an Inner Function

```javascript
function x() {
  var a = 7;

  function y() {
    console.log(a);
  }

  return y;
}

var z = x();
```

`x()` returns the function `y`, so `z` now refers to that function:

```text
x()
 ↓
returns y
 ↓
z → y
```

The function can also be returned directly:

```javascript
function x() {
  return function y() {
    console.log("Hello");
  };
}
```

Both forms return a function. The first form makes the surrounding lexical environment easier to see.

---

## 4. The Outer Function Can Finish

After this statement:

```javascript
var z = x();
```

`x()` has finished executing, so its execution context is no longer active on the Call Stack.

However, this still works:

```javascript
z();
```

Complete example:

```javascript
function x() {
  var a = 7;

  function y() {
    console.log(a);
  }

  return y;
}

var z = x();

z(); // 7
```

Although `x()` has finished, `y` still has access to `a` through the lexical environment retained by the closure.

```text
z
 ↓
function y
 ↓
retained lexical environment of x
 ↓
a → 7
```

---

## 5. A Closure Retains Bindings, Not Frozen Snapshots

A closure retains access to a binding or reference. It does not necessarily store a frozen copy of the value at the moment the function is returned.

```javascript
function x() {
  var a = 7;

  function y() {
    console.log(a);
  }

  a = 100;
  return y;
}

var z = x();
z(); // 100
```

The sequence is:

```text
a → 7
a → 100
y retains access to a
z() reads a
→ 100
```

This is why it is more accurate to say that a closure preserves access to a variable's binding rather than storing only its original value.

---

## 6. Why the Outer Environment Remains Available

Normally, local data can become eligible for garbage collection when nothing can reach it after a function finishes.

In a closure, the returned function still refers to the outer environment:

```text
z
 ↓
function y
 ↓
closure
 ↓
lexical environment containing a
 ↓
a → 7
```

Because that environment remains reachable, the data needed by `y` can remain available. Garbage collection is based on reachability, not simply on whether the original function has returned.

---

## 7. Closures Can Reach Multiple Outer Scopes

A closure can access variables from more than one outer lexical environment.

```javascript
function z() {
  var b = 900;

  function x() {
    var a = 7;

    function y() {
      console.log(a, b);
    }

    y();
  }

  x();
}

z(); // 7 900
```

The lexical chain is:

```text
y
↓
x
↓
z
↓
Global
```

Lookup works normally:

```text
a → found in x
b → found in z
```

Closures preserve the function's access to the relevant outer environments.

---

## 8. Functions Are First-Class Values

JavaScript functions can be:

- stored in variables
- passed as arguments
- returned from other functions

The last case is central to many closure examples:

```javascript
function createMessage() {
  const message = "Hello";

  return function showMessage() {
    console.log(message);
  };
}

const show = createMessage();
show(); // Hello
```

`show` refers to the returned function, which retains access to `message`.

---

## 9. Closures Preserve State

Closures are useful when a function needs private state that persists between calls.

```javascript
function counter() {
  let count = 0;

  return function increment() {
    count++;
    console.log(count);
  };
}

const increment = counter();

increment(); // 1
increment(); // 2
increment(); // 3
```

The returned function continues to access the same `count` binding:

```text
increment
    ↓
closure
    ↓
count → 0 → 1 → 2 → 3
```

The state is not directly accessible from outside, but the returned function can use and update it.

---

## 10. Closures and Delayed Callbacks

Callbacks often execute after the function that created them has finished.

```javascript
function x() {
  var a = 7;

  setTimeout(function () {
    console.log(a);
  }, 1000);
}

x();
```

Conceptually:

```text
x() starts
  ↓
a = 7
  ↓
callback created
  ↓
x() finishes
  ↓
callback runs later
  ↓
closure finds a
  ↓
7
```

The callback retains access to the variables from the scope in which it was created.

---

## 11. Common Uses of Closures

Closures commonly support:

- **Data hiding and encapsulation:** keep internal state private.
- **Module patterns:** expose selected functions while hiding implementation details.
- **Currying:** retain earlier arguments while producing another function.
- **Memoization:** preserve cached results between calls.
- **Callbacks and asynchronous code:** access surrounding variables later.
- **Iterators:** preserve progress between successive operations.

The shared idea is that a function keeps access to state from its surrounding lexical environment.

---

## 12. Closure vs Scope Chain

These concepts are related but different.

### Scope Chain

The scope chain describes how JavaScript searches for a variable:

```text
Current scope
    ↓
Parent scope
    ↓
Parent's scope
    ↓
Global scope
```

### Closure

A closure is a function together with retained access to its surrounding lexical environment.

```text
Scope chain → explains how lookup works
Closure     → explains why a function can retain that access later
```

---

## 13. Closure vs Execution Context

An **execution context** is created when code executes.

A **closure** describes a function's retained relationship with its lexical environment.

A typical sequence is:

```text
x() executes
  ↓
execution context for x is created
  ↓
y is created inside x
  ↓
y retains access to x's lexical environment
  ↓
y is returned
  ↓
x finishes
  ↓
y can still access required variables
```

These terms should not be used interchangeably.

---

## 14. Common Misconceptions

### “A closure is just a returned function.”

Not exactly. A closure is a function plus its retained lexical environment. Returning a function is a common way to demonstrate the behavior.

### “A closure stores only the value.”

More precisely, it retains access to the relevant binding. If the binding changes before the function runs, the function can observe the updated value.

### “The outer function must still be running.”

No. A closure can access the outer environment after the outer function has finished.

### “A closure and the scope chain are the same.”

No. The scope chain describes variable lookup; a closure describes a function's retained access to its lexical environment.

---

## 15. Interview Answer

> A closure is a function bundled with its lexical environment. It allows the function to retain access to variables from its surrounding scope even after the outer function has finished executing.

Example:

```javascript
function x() {
  var a = 7;

  function y() {
    console.log(a);
  }

  return y;
}

var z = x();
z(); // 7
```

Here, `y` forms a closure with the lexical environment of `x`. Even after `x()` finishes, `z()` can still access `a`.

---

## 16. Final Mental Model

```text
Function created
      ↓
Function retains access to its lexical environment
      ↓
Function is returned or used later
      ↓
Outer function may finish
      ↓
Required environment remains reachable
      ↓
Function can still access outer variables
```

### Core relationship

```text
Function
   +
Retained lexical environment
   =
Closure
```

### Key takeaways

```text
1. A closure is a function plus its lexical environment.
2. An inner function can access variables from outer scopes.
3. A returned function can continue using those variables later.
4. Closures retain access to bindings, not merely frozen values.
5. Reachable closure environments can keep required state alive.
6. Closures are useful for private state, modules, currying, memoization, callbacks, and iterators.
7. Scope chains explain lookup; closures explain retained access.
8. A closure does not require the outer function to keep running.
```

> **Core rule:** A closure is a function together with the lexical environment it retains access to.
