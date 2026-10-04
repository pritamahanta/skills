# `setTimeout` and Closures in JavaScript

## 1. `setTimeout` Does Not Block JavaScript

Consider:

```javascript
function x() {
  var i = 1;

  setTimeout(function () {
    console.log(i);
  }, 3000);

  console.log("Namaste JavaScript");
}

x();
```

Output:

```text
Namaste JavaScript
1
```

The callback runs after approximately three seconds, but `setTimeout` does not make JavaScript wait. It registers the timer and callback, then synchronous execution continues.

```text
setTimeout called
      ↓
timer and callback registered
      ↓
synchronous code continues
      ↓
"Namaste JavaScript" is printed
      ↓
timer expires
      ↓
callback becomes eligible to run
      ↓
1 is printed
```

The callback runs later when JavaScript can process it; the timer does not interrupt or pause the current execution.

---

## 2. Why the Callback Can Access `i`

```javascript
function x() {
  var i = 1;

  setTimeout(function () {
    console.log(i);
  }, 3000);
}

x();
```

The callback references `i`, which belongs to `x`. The callback therefore forms a closure with the lexical environment where it was created.

```text
Callback function
       +
Lexical environment containing i
       =
Closure
```

This retained access allows the callback to read `i` later, even after `x()` has finished.

---

## 3. Closures Retain Bindings

A closure retains access to a binding; it is not necessarily a frozen snapshot of the value.

```javascript
function x() {
  var i = 1;

  setTimeout(function () {
    console.log(i);
  }, 3000);

  i = 100;
}

x();
```

After three seconds, the callback prints:

```text
100
```

The callback reads the same `i` binding after it has changed:

```text
i → 1
  ↓
i → 100
  ↓
callback runs
  ↓
reads i → 100
```

The useful mental model is:

```text
Closure → retains access to the binding
```

not:

```text
Closure → stores only the original value
```

---

## 4. The Classic Loop Problem

Suppose we want to print each number after its corresponding delay:

```text
1 → after 1 second
2 → after 2 seconds
3 → after 3 seconds
4 → after 4 seconds
5 → after 5 seconds
```

A natural attempt is:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

The actual output is:

```text
6
6
6
6
6
```

Each value appears after its scheduled delay, but every callback prints `6`.

---

## 5. Why `var` Prints `6` Five Times

`var` is not block-scoped. In this loop, there is one shared `i` binding.

All five callbacks close over that same binding:

```text
              i
              ↑
      ┌───────┼────────┐
      │       │        │
 callback  callback  callback ...
      │       │        │
      └───────┴────────┘
          same binding
```

The callbacks remember access to `i`, not the value that `i` had when each callback was created.

### Loop execution

```text
Iteration 1: i = 1 → callback closes over shared i
Iteration 2: i = 2 → callback closes over shared i
Iteration 3: i = 3 → callback closes over shared i
Iteration 4: i = 4 → callback closes over shared i
Iteration 5: i = 5 → callback closes over shared i
```

After the fifth iteration, the increment runs:

```text
i = 5 → i = 6
```

Then `i <= 5` is false and the loop ends. When the callbacks run later, they all read the same binding:

```text
Callback 1 → i → 6
Callback 2 → i → 6
Callback 3 → i → 6
Callback 4 → i → 6
Callback 5 → i → 6
```

The problem is not a broken timer. It is the combination of:

```text
var + one shared binding + closures + delayed execution
```

---

## 6. Why `let` Fixes the Problem

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

Output:

```text
1
2
3
4
5
```

A `for` loop with `let` provides a distinct per-iteration binding for `i`.

```text
Iteration 1: i₁ → 1 → callback 1
Iteration 2: i₂ → 2 → callback 2
Iteration 3: i₃ → 3 → callback 3
Iteration 4: i₄ → 4 → callback 4
Iteration 5: i₅ → 5 → callback 5
```

Each callback closes over its own iteration's binding:

```text
callback 1 → i₁ → 1
callback 2 → i₂ → 2
callback 3 → i₃ → 3
callback 4 → i₄ → 4
callback 5 → i₅ → 5
```

This is more precise than saying that `let` gives each callback a copy of the value. Each callback receives access to a distinct binding.

---

## 7. Solving It With `var` and a Function

The same behavior can be created with `var` by introducing a new function scope for each iteration:

```javascript
function close(i) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}

for (var i = 1; i <= 5; i++) {
  close(i);
}
```

Output:

```text
1
2
3
4
5
```

Each call to `close` creates a new execution context and a new parameter binding:

```text
close(1) → local i₁ → callback 1
close(2) → local i₂ → callback 2
close(3) → local i₃ → callback 3
close(4) → local i₄ → callback 4
close(5) → local i₅ → callback 5
```

Each callback closes over a different function-call environment.

The two fixes use different mechanisms:

```text
let       → new per-iteration binding
function  → new per-call binding
```

---

## 8. Comparing the Binding Models

### Incorrect `var` version

```text
One shared i
     ↓
1 → 2 → 3 → 4 → 5 → 6
 ↑    ↑    ↑    ↑    ↑
all callbacks read this binding
```

### Correct `let` version

```text
callback 1 → i₁ = 1
callback 2 → i₂ = 2
callback 3 → i₃ = 3
callback 4 → i₄ = 4
callback 5 → i₅ = 5
```

### Correct function-scope version

```text
callback 1 → local i₁ = 1
callback 2 → local i₂ = 2
callback 3 → local i₃ = 3
callback 4 → local i₄ = 4
callback 5 → local i₅ = 5
```

The central question is:

> Are all callbacks sharing one binding, or does each callback have its own binding?

---

## 9. `setTimeout` Execution Flow

For:

```javascript
setTimeout(function () {
  console.log(i);
}, 3000);
```

the simplified flow is:

```text
JavaScript reaches setTimeout
        ↓
callback and timer are registered
        ↓
current synchronous code continues
        ↓
synchronous execution finishes
        ↓
timer expires
        ↓
callback becomes eligible to run
        ↓
callback executes
```

The detailed event-loop and callback-queue mechanics belong to the broader asynchronous JavaScript model. For this topic, remember:

> `setTimeout` schedules work for later; it does not block the current JavaScript execution.

---

## 10. Common Mistakes

### “`setTimeout` waits for the timer.”

No. It schedules a callback and synchronous code continues:

```javascript
setTimeout(callback, 3000);
console.log("Hello");
```

`"Hello"` is printed before the callback.

### “The closure stores the value of `i`.”

More precisely, it retains access to the relevant binding. A later change to that binding can affect what the callback reads.

### “The problem happens only because `setTimeout` is asynchronous.”

The full cause is:

```text
var + shared binding + closure + delayed callback
```

### “Using `let` gives each callback a copied value.”

The precise explanation is that the loop creates a separate per-iteration binding, and each callback closes over that binding.

### “Closures occur only when a function is returned.”

No. A `setTimeout` callback can form a closure simply by referencing a variable from an outer scope.

---

## 11. Interview Questions

### Does `setTimeout` block JavaScript execution?

No. It schedules a callback for later, while the remaining synchronous code continues.

### Why does the `var` loop print `6` five times?

All callbacks close over the same `var` binding. The loop finishes before the callbacks run, so the shared `i` is `6` when they read it.

### Why does `let` solve the problem?

The loop creates a distinct per-iteration binding for `i`, so each callback closes over a different binding.

### Can the problem be solved without `let`?

Yes. Pass the value into a function called during each iteration:

```javascript
function close(i) {
  setTimeout(() => console.log(i), i * 1000);
}

for (var i = 1; i <= 5; i++) {
  close(i);
}
```

Each function call creates a separate parameter binding.

### What does the callback close over?

It closes over the lexical environment and bindings it needs from its surrounding scope.

### Does a closure remember a value or a reference?

The useful mental model is that it retains access to a binding/reference, not simply a frozen copy of the value.

---

## 12. Final Mental Model

### With `var`

```text
for loop
   ↓
one shared i
   ↓
callbacks close over the same i
   ↓
loop finishes
   ↓
i = 6
   ↓
callbacks execute
   ↓
6 6 6 6 6
```

### With `let`

```text
for loop
   ↓
new binding for each iteration
   ↓
each callback closes over its own i
   ↓
callbacks execute
   ↓
1 2 3 4 5
```

### With a function scope

```text
for loop
   ↓
close(i)
   ↓
new function-call environment
   ↓
callback closes over that call's i
   ↓
1 2 3 4 5
```

---

## 13. Key Takeaways

```text
1. setTimeout does not block JavaScript execution.
2. A delayed callback can form a closure over outer variables.
3. A closure retains access to a binding, not simply a frozen value.
4. With var in a loop, all callbacks can share the same i.
5. The loop finishes first, leaving the shared i equal to 6.
6. Therefore all callbacks print 6.
7. let creates a distinct per-iteration binding.
8. A function call can create a separate binding for each iteration.
9. The key question is whether callbacks share one binding or use separate bindings.
```

> **Core rule:** When a delayed callback closes over a loop variable, determine whether every callback shares the same binding or whether each callback has its own binding. That distinction explains `var` producing `6 6 6 6 6` and `let` producing `1 2 3 4 5`.
