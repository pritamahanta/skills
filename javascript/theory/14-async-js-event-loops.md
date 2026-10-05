# Asynchronous JavaScript & the Event Loop

## 1. JavaScript Is Single-Threaded

JavaScript executes code on a single **Call Stack**. Only one JavaScript operation can execute at a time.

This means:

- synchronous code runs in order
- the Call Stack does not wait for timers or network operations
- long-running synchronous work blocks other JavaScript from executing

A useful rule is:

> The Call Stack executes whatever is placed on it; it does not wait for asynchronous operations.

Asynchronous work therefore relies on capabilities provided by the surrounding runtime.

---

## 2. The Browser Provides Web APIs

The JavaScript engine executes JavaScript, while the browser provides additional capabilities through **Web APIs**.

Examples include:

```text
Timers
DOM
Fetch and network access
Local Storage
Geolocation
Bluetooth
```

Conceptually:

```text
Browser
│
├── JavaScript Engine
│     └── Call Stack
│
└── Web APIs
      ├── Timer
      ├── DOM APIs
      ├── Fetch
      ├── Local Storage
      └── Other browser features
```

Examples:

```javascript
setTimeout(callback, 5000);
document.getElementById("btn");
fetch("https://example.com");
localStorage;
```

These capabilities come from the browser/runtime environment rather than the core JavaScript language itself.

In a browser's global environment, many browser APIs are available through `window`:

```javascript
window.setTimeout;
window.localStorage;
window.console.log;
```

Usually, `window` is omitted:

```javascript
setTimeout(callback, 5000);
```

---

## 3. `setTimeout` Does Not Block

```javascript
console.log("Start");

setTimeout(function cb() {
  console.log("Timer");
}, 5000);

console.log("End");
```

Output:

```text
Start
End
Timer
```

`setTimeout` registers the timer and callback, then JavaScript continues. It does not pause the current execution.

Simplified flow:

```text
"Start" is printed
      ↓
setTimeout registers timer and callback
      ↓
JavaScript continues
      ↓
"End" is printed
      ↓
synchronous code finishes
      ↓
timer expires
      ↓
callback becomes ready to run
```

The delay is a minimum wait, not a guarantee that the callback runs exactly at that moment.

---

## 4. Callback Queue and Event Loop

When a timer expires or an event occurs, its callback cannot interrupt JavaScript already running on the Call Stack.

The callback first waits in a **Callback Queue**, also called the **Task Queue**.

```text
Timer expires
      ↓
Callback becomes ready
      ↓
Callback Queue
```

The **Event Loop** coordinates the queue and the Call Stack:

```text
Callback Queue
      │
      ▼
  Event Loop
      │
      ▼
  Call Stack
```

A simplified rule is:

```text
If the Call Stack is empty
and a callback is waiting,
move the callback to the Call Stack.
```

The Call Stack executes the callback. The Event Loop coordinates when it may be moved; it does not execute the callback itself.

---

## 5. Complete Timer Flow

```text
JavaScript code
      ↓
setTimeout(callback, delay)
      ↓
Browser timer tracks the delay
      ↓
JavaScript continues
      ↓
Timer expires
      ↓
Callback Queue
      ↓
Event Loop waits for an available Call Stack
      ↓
Call Stack
      ↓
Callback executes
```

Therefore:

> `setTimeout(callback, 5000)` means the callback will not run before the timer is ready. It may run later if the Call Stack is busy or other work has priority.

---

## 6. Event Listeners Use the Same Model

```html
<button id="btn">Click Me</button>
```

```javascript
console.log("Start");

document
  .getElementById("btn")
  .addEventListener("click", function cb() {
    console.log("Callback");
  });

console.log("End");
```

Before the button is clicked, the output is:

```text
Start
End
```

Registering the listener does not call `cb`. The browser keeps the listener registered until the event occurs or the listener is removed.

When the user clicks:

```text
Click event occurs
      ↓
Registered callback becomes ready
      ↓
Callback Queue
      ↓
Event Loop
      ↓
Call Stack
      ↓
Callback executes
```

If several clicks occur while the Call Stack is busy, their callbacks may wait in the queue and run one at a time when the stack becomes available.

---

## 7. Why the Callback Queue Is Needed

Suppose the Call Stack is busy:

```text
Call Stack
──────────
LongRunningFunction
```

If a timer or event callback becomes ready, it cannot execute simultaneously:

```text
Callback Queue
──────────────
Timer Callback
```

The Event Loop waits until the current synchronous work finishes, then moves the callback to the Call Stack. This preserves the single-threaded execution model.

---

## 8. `fetch` and the Microtask Queue

Promises use a separate **Microtask Queue**.

```javascript
console.log("Start");

setTimeout(function cbT() {
  console.log("CB Timeout");
}, 5000);

fetch("https://api.netflix.com").then(function cbF() {
  console.log("CB Netflix");
});

console.log("End");
```

Conceptually:

```text
setTimeout
  ↓
timer tracks delay

fetch
  ↓
network request handled by runtime
  ↓
Promise waits for response
```

When the Promise is fulfilled, `cbF` is placed in the Microtask Queue. When the timer expires, `cbT` is placed in the regular Callback/Task Queue.

---

## 9. Microtask Queue vs Callback Queue

### Microtask Queue

Common sources include:

```text
Promise callbacks
MutationObserver callbacks
```

### Callback Queue / Task Queue

Common sources include:

```text
setTimeout callbacks
event callbacks
other regular tasks
```

Conceptually:

```text
Ready asynchronous callbacks
             │
      ┌──────┴──────┐
      ▼             ▼
Microtask Queue  Callback Queue
      │             │
      └──────┬──────┘
             ▼
         Event Loop
             ▼
         Call Stack
```

Microtasks have priority over regular tasks. After the current synchronous work finishes, the runtime processes pending microtasks before moving on to regular callbacks.

Under the timing described above, the output is:

```text
Start
End
CB Netflix
CB Timeout
```

The network response is ready after approximately two seconds, while the timer is ready after approximately five seconds. In addition, the Promise callback uses the higher-priority Microtask Queue.

---

## 10. Microtask Starvation

Because microtasks have priority, continuously creating new microtasks can delay regular tasks:

```text
Microtask
   ↓
creates another microtask
   ↓
creates another microtask
   ↓
continues indefinitely
```

Meanwhile:

```text
Callback Queue
──────────────
Timer callback waiting
```

If the Microtask Queue never becomes empty, regular callbacks may be delayed indefinitely. This is called **microtask starvation**.

---

## 11. `setTimeout(..., 0)` Is Not Immediate

```javascript
setTimeout(function () {
  console.log("Timer");
}, 0);

console.log("End");
```

Output:

```text
End
Timer
```

Even with a zero-millisecond delay, the callback must:

1. become eligible after the timer rules allow it
2. wait in the task queue
3. wait for the Call Stack to become available
4. be selected by the Event Loop

If a long task is running, the delay can be much longer:

```text
setTimeout(callback, 0)
      ↓
long task occupies Call Stack
      ↓
timer becomes ready
      ↓
callback waits in the queue
      ↓
long task finishes
      ↓
callback enters Call Stack
```

So `setTimeout(callback, 0)` means “run as soon as scheduling allows,” not “run immediately.”

---

## 12. Blocking the Main Thread

```javascript
function longTask() {
  // Takes a long time.
}

longTask();
```

While `longTask` occupies the Call Stack, no other JavaScript callback can execute:

```text
Call Stack
──────────
longTask
```

This can make a page unresponsive. Avoid unnecessary long-running synchronous work on the main thread.

---

## 13. Not Every Callback Is Asynchronous

A function being passed as a callback does not automatically make it asynchronous.

These callbacks execute synchronously as part of the array operation:

```javascript
array.map(function callback() {
  // synchronous
});

array.filter(function callback() {
  // synchronous
});

array.reduce(function callback() {
  // synchronous
});
```

By contrast, callbacks associated with timers, events, or asynchronous network operations use the runtime's asynchronous scheduling mechanisms.

```text
map/filter/reduce callbacks
→ normal synchronous JavaScript

timer/event/Promise callbacks
→ runtime scheduling mechanism
```

---

## 14. Event Loop Architecture

```text
                         BROWSER / RUNTIME
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
          Web APIs          JavaScript          Other runtime
             │               Call Stack          features
             │                  │
             │                  │
             ▼                  │
   Async operation completes    │
             │                  │
             ├── Microtask Queue│
             │                  │
             └── Callback Queue │
                    │           │
                    └── Event Loop ───► Call Stack
```

The execution pattern is:

```text
Synchronous code
      ↓
Call Stack
      ↓
Async operation registered with runtime
      ↓
JavaScript continues
      ↓
Operation completes
      ↓
Callback enters Microtask Queue or Callback Queue
      ↓
Event Loop schedules eligible work
      ↓
Call Stack
      ↓
Callback executes
```

Priority model:

```text
1. Current synchronous Call Stack work
2. Microtasks
3. Regular tasks / Callback Queue
```

The browser's complete scheduling model contains additional details, but this is the core model for understanding these examples.

---

## 15. Important Distinctions

| Concept | Purpose |
|---|---|
| Call Stack | Executes JavaScript |
| Web APIs | Provide browser/runtime capabilities |
| Timer | Tracks a delay for timer APIs |
| Callback Queue / Task Queue | Holds ready regular asynchronous callbacks |
| Microtask Queue | Holds Promise and `MutationObserver` callbacks |
| Event Loop | Coordinates moving eligible queued work to the Call Stack |
| Event Listener | Waits for browser events |
| `fetch()` | Performs asynchronous network operations |

---

## 16. Common Mistakes

### “`setTimeout` executes exactly after the specified delay.”

No. The delay determines when the callback becomes eligible. The callback can still wait for the Call Stack and scheduling priority.

### “`setTimeout(fn, 0)` runs immediately.”

No. It still waits for timer eligibility, the task queue, and an available Call Stack.

### “Callbacks execute outside the Call Stack.”

No. When JavaScript executes a callback, it executes on the Call Stack.

### “The Event Loop executes JavaScript.”

The Event Loop coordinates scheduling. The Call Stack executes JavaScript.

### “All callbacks use the Callback Queue.”

Promise and `MutationObserver` callbacks use the Microtask Queue, which has higher priority than regular tasks.

### “Callbacks make JavaScript multithreaded.”

No. They provide asynchronous behavior around a single JavaScript execution thread.

### “Callbacks passed to `map`, `filter`, and `reduce` go to Web APIs.”

No. Those methods invoke their callbacks synchronously.

### “The Event Loop stops after one callback.”

It continues coordinating work while the runtime remains active.

---

## 17. Interview Questions

### What is the Event Loop?

The Event Loop coordinates queued asynchronous callbacks and the Call Stack. When the stack is available, it helps schedule eligible queued work for execution.

### Why is the Event Loop needed?

JavaScript uses a single Call Stack, so asynchronous callbacks need a mechanism that lets them wait without interrupting current synchronous work.

### What is the Callback Queue?

It holds ready callbacks from regular asynchronous tasks while they wait for the Call Stack.

### What is the Microtask Queue?

It holds higher-priority callbacks such as Promise reactions and `MutationObserver` callbacks.

### Which queue has higher priority?

The Microtask Queue has priority over the regular Callback/Task Queue.

### Why does `setTimeout(fn, 0)` not run immediately?

The callback must become eligible, enter the task scheduling mechanism, wait for the Call Stack, and then be selected by the Event Loop.

### What happens when a timer expires?

Its callback becomes ready and waits in the regular task/callback scheduling mechanism until it can execute on the Call Stack.

### What happens when a button is clicked?

The registered event callback becomes ready, is queued, and is eventually moved to the Call Stack for execution.

### What is microtask starvation?

It occurs when continuously generated microtasks prevent regular tasks from getting a chance to execute.

### Are `map`, `filter`, and `reduce` callbacks asynchronous?

No. They execute synchronously as part of the corresponding array method.

### Can long-running JavaScript block asynchronous callbacks?

Yes. A busy Call Stack prevents queued callbacks from executing until the synchronous work finishes.

---

## 18. Final Mental Model

```text
                  JavaScript Runtime
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
       Web APIs      Call Stack       Queues
          │              │        ┌─────┴─────┐
          │              │        │           │
          │              │        ▼           ▼
          │              │   Microtask     Callback
          │              │     Queue         Queue
          │              │        │           │
          │              │        └─────┬─────┘
          │              │              │
          │              ◄──── Event Loop
          │
          ├── Timer
          ├── DOM Events
          └── Network APIs
```

### Core takeaway

> JavaScript remains single-threaded at the level of its Call Stack, while the browser/runtime provides asynchronous capabilities through Web APIs. When an asynchronous operation completes, its callback is queued. The Event Loop coordinates moving queued callbacks to the Call Stack, with microtasks receiving priority over regular task callbacks.
