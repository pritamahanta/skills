# Callback Functions & Event Listeners in JavaScript

## 1. Callback Functions

JavaScript functions are **first-class values**, so they can be stored, passed, and returned.

A **callback function** is a function passed to another function so that the receiving function can invoke it later or at an appropriate time.

```javascript
function x(y) {
  console.log("x");
  y();
}

x(function y() {
  console.log("y");
});
```

Here, `x` is the receiving function and `y` is the callback.

```text
Function passed as a value
        ↓
Receiving function controls when to invoke it
        ↓
Callback executes
```

---

## 2. Callbacks With `setTimeout`

```javascript
setTimeout(function () {
  console.log("Timer");
}, 1000);
```

The first argument is the callback and the second is the delay:

```text
setTimeout(callback, delay)
```

The callback is registered to run later. It does not run immediately when it is passed to `setTimeout`.

---

## 3. Callbacks and Asynchronous JavaScript

JavaScript executes one piece of JavaScript at a time on its main thread. Callback-based APIs allow code to respond to operations that complete later.

```javascript
setTimeout(function () {
  console.log("Timer");
}, 5000);

function x(y) {
  console.log("x");
  y();
}

x(function y() {
  console.log("y");
});
```

Output:

```text
x
y
Timer
```

The synchronous calls complete first. The timer callback runs later.

### Simplified flow

```text
Synchronous JavaScript executes
        ↓
Async operation is registered
        ↓
JavaScript continues
        ↓
Operation completes
        ↓
Callback becomes ready
        ↓
Callback executes through the Call Stack
```

---

## 4. The Call Stack and Main Thread

When `y()` is called inside `x()`, it is pushed onto the Call Stack:

```text
y()
x()
Global
```

After `y()` finishes:

```text
x()
Global
```

After `x()` finishes, the stack returns to the global code. Later, a timer or event callback also enters the Call Stack when it executes.

> All JavaScript callback code eventually executes through the Call Stack.

Because the main JavaScript thread executes one operation at a time, long-running synchronous code blocks other JavaScript work:

```text
Long-running function
        ↓
Call Stack blocked
        ↓
Other JavaScript and UI work waits
```

Avoid unnecessary long-running synchronous work on the main thread.

---

## 5. Ordering Asynchronous Operations With Callbacks

Callbacks can start the next operation only after the current one finishes.

```javascript
function printStr(str, callback) {
  setTimeout(() => {
    console.log(str);
    callback();
  }, Math.floor(Math.random() * 100) + 1);
}

function printAll() {
  printStr("A", () => {
    printStr("B", () => {
      printStr("C", () => {});
    });
  });
}

printAll();
```

The output is always:

```text
A
B
C
```

The delays are random, but the next timer is not started until the previous callback invokes the next function:

```text
A starts
  ↓
A finishes and prints
  ↓
B starts
  ↓
B finishes and prints
  ↓
C starts
  ↓
C finishes and prints
```

This nested structure represents dependencies between operations. Excessive nesting can become **callback hell**.

---

## 6. Event Listeners

An event listener registers a callback to run when a particular event occurs.

Common browser events include:

```text
click, hover, keypress, scroll
```

Example HTML:

```html
<button id="clickMe">Click Me!</button>
```

JavaScript:

```javascript
document
  .getElementById("clickMe")
  .addEventListener("click", function () {
    console.log("Button clicked");
  });
```

The pattern is:

```text
Event source
     ↓
addEventListener(event type, callback)
     ↓
Event occurs
     ↓
Callback executes
```

Registering the listener does not call the callback immediately. The callback waits until the event occurs.

---

## 7. Event Listener Execution

For a button click:

```text
User clicks button
       ↓
Click event occurs
       ↓
Registered callback becomes ready
       ↓
Callback enters the Call Stack
       ↓
Callback executes
```

The callback tells JavaScript what to do when the event happens:

```javascript
button.addEventListener("click", function () {
  console.log("Button clicked");
});
```

Here, `"click"` is the event type and the function is the callback.

---

## 8. A Counter With an Event Listener

A basic counter can be written as:

```javascript
let count = 0;

button.addEventListener("click", function () {
  console.log("Button clicked", ++count);
});
```

Each click increments `count`:

```text
Button clicked 1
Button clicked 2
Button clicked 3
```

However, global state can be changed by unrelated code:

```javascript
count = 1000;
```

When state belongs to one behavior, keeping it global is often undesirable.

---

## 9. Using a Closure for Private State

Put the counter inside a function that registers the listener:

```javascript
function attachEventListener() {
  let count = 0;

  document
    .getElementById("clickMe")
    .addEventListener("click", function handleClick() {
      console.log("Button clicked", ++count);
    });
}

attachEventListener();
```

The callback uses `count` from `attachEventListener`, so it forms a closure:

```text
attachEventListener()
       ↓
count is created
       ↓
callback is created
       ↓
callback closes over count
       ↓
button click
       ↓
callback increments count
```

Outside code cannot directly access the local `count`, but the callback can continue using it.

This gives a simple form of data abstraction:

```text
Private count
      ↓
Event callback controls access
```

---

## 10. Event Listeners, Closures, and Memory

After `attachEventListener()` returns, its execution context is no longer active on the Call Stack. However, the registered callback still needs `count`.

```text
Event listener
      ↓
Callback
      ↓
Closure
      ↓
count
```

The required lexical environment remains reachable through the callback. It cannot be reclaimed while the listener and callback still keep it reachable.

Long-lived or unnecessary listeners can therefore keep closure-related data alive and increase memory or processing costs. This is especially relevant for frequently used events such as `scroll` and `mousemove`.

---

## 11. Removing Event Listeners

Remove a listener when it is no longer needed:

```javascript
function handleClick() {
  console.log("Button clicked");
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);
```

Registration and removal must use the same function reference and compatible listener options.

This does not work:

```javascript
button.addEventListener("click", function () {
  console.log("clicked");
});

button.removeEventListener("click", function () {
  console.log("clicked");
});
```

Although the function bodies look identical, they are two different function objects. Store the callback in a variable or use a named function so the same reference can be supplied for removal.

---

## 12. Callback Flow Summary

### Timer callback

```text
setTimeout(callback, delay)
        ↓
Timer and callback registered
        ↓
Synchronous JavaScript continues
        ↓
Timer expires
        ↓
Callback becomes ready
        ↓
Callback enters the Call Stack
        ↓
Callback executes
```

### Event listener callback

```text
addEventListener(event, callback)
        ↓
Callback registered
        ↓
Event occurs
        ↓
Callback becomes ready
        ↓
Callback enters the Call Stack
        ↓
Callback executes
```

The runtime environment coordinates timers and events, while JavaScript callback code executes on the main JavaScript thread.

---

## 13. Common Mistakes

### “`setTimeout` makes JavaScript wait.”

No. It schedules a callback and synchronous execution continues.

### “A callback runs immediately when passed.”

No. The receiving API determines when it invokes the callback.

### “Callbacks make JavaScript multithreaded.”

No. They provide asynchronous behavior, but JavaScript execution still occurs one operation at a time on its main thread in this model.

### “A callback runs outside the Call Stack.”

No. When it executes, it runs through the Call Stack.

### “A global counter is always appropriate.”

Global state can be changed by unrelated code. A closure can keep component-specific state private.

### “A closure duplicates the value.”

A closure retains access to the relevant lexical binding.

### “Any function can remove an event listener.”

The same function reference used during registration must be supplied to `removeEventListener`, with compatible options.

---

## 14. Interview Questions

### What is a callback function?

A function passed to another function so the receiving function can invoke it later or when a particular operation is ready.

### Why are callbacks important?

They let JavaScript respond to timers, events, and other operations that complete later while synchronous execution continues.

### Is JavaScript single-threaded when callbacks are used?

Yes. Callback-based asynchronous behavior does not change the single-threaded execution model.

### Does `setTimeout` block the Call Stack?

No. It registers a timer and returns so synchronous JavaScript can continue.

### What happens when a timer finishes?

The callback becomes eligible to run and is eventually executed through the Call Stack.

### What is an event listener?

A registration that associates an event type with a callback to run when that event occurs.

### Why use a closure for an event-listener counter?

The closure lets the callback retain access to `count` while keeping that state private to the enclosing function.

### Why can an event listener keep memory alive?

The listener can keep its callback reachable, and the callback can retain its lexical environment through a closure.

### How do you remove an event listener?

Use `removeEventListener()` with the same event type, function reference, and compatible listener options used during registration.

---

## 15. Final Mental Model

### Callback

```text
Function is first-class
        ↓
Passed to another function
        ↓
Receiving function decides when to invoke it
        ↓
Callback executes
```

### Closure with an event listener

```text
attachEventListener()
       │
       ├── count
       │
       └── callback
             │
             └── closes over count
                    ↓
                event occurs
                    ↓
                callback runs
                    ↓
                count is accessed
```

### Core rule

> A callback is a function passed to another function for later invocation. Timers and event listeners use callbacks extensively, and closures allow those callbacks to retain access to surrounding state after the original function has finished.

---

## 16. Key Takeaways

```text
1. Functions are first-class values in JavaScript.
2. A callback is a function passed for later or event-driven invocation.
3. setTimeout schedules a callback; it does not block execution.
4. Callback code eventually runs through the Call Stack.
5. Blocking the Call Stack blocks other JavaScript work.
6. Event listeners register callbacks for events such as click and scroll.
7. Closures let event callbacks retain access to surrounding state.
8. Closures can keep state private instead of exposing it globally.
9. Long-lived listeners can keep closure environments reachable.
10. Unnecessary listeners should be removed.
11. removeEventListener requires the same callback reference used during registration.
12. Nested callbacks can enforce order, but excessive nesting can lead to callback hell.
```
