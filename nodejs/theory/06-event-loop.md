# The Node.js Event Loop

The Event Loop is the core mechanism behind Node.js asynchronous execution. The general idea is familiar; this guide explains how it works in more detail.

## 1. What Is the Event Loop?

The **Event Loop** is the mechanism Node.js uses to process asynchronous callbacks and coordinate when JavaScript can execute them.

Node.js starts by executing the initial JavaScript code. Once that code finishes, Node.js continues cycling through Event Loop phases while there is work to process.

Think of it like this:

```text
JavaScript code
      ↓
Start asynchronous work
      ↓
JavaScript continues
      ↓
Event Loop
      ↓
Check for ready callbacks
      ↓
Run them
      ↓
Repeat
```

## 2. First Understand the Call Stack

Before learning about the Event Loop, remember that JavaScript code runs on the **call stack**.

For example:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

During execution, the stack contains the active function calls:

```text
Call Stack

┌─────────────────────┐
│ console.log(...)    │
├─────────────────────┤
│ add(2, 3)           │
└─────────────────────┘
          ↓
       Execute
          ↓
     Stack empties
```

JavaScript executes one piece of synchronous code at a time.

## 3. Where the Event Loop Becomes Useful

Consider:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

### Step 1: Execute the first statement

```text
Call Stack
┌─────────────────────┐
│ console.log("A")    │
└─────────────────────┘
```

Output:

```text
A
```

### Step 2: Register the timer

When Node.js encounters `setTimeout()`, the timer is registered. The callback does not execute immediately.

JavaScript then continues running.

### Step 3: Execute the next statement

```text
Call Stack
┌─────────────────────┐
│ console.log("C")    │
└─────────────────────┘
```

Output:

```text
C
```

### Step 4: Process the ready timer callback

After the initial script finishes, Node.js processes the Event Loop. When the timer is eligible, its callback runs:

```text
Event Loop
    ↓
Timer callback ready
    ↓
Call Stack
    ↓
console.log("B")
```

Final output:

```text
A
C
B
```

### Important lesson

`setTimeout(..., 0)` does not mean “run immediately.” It means the callback becomes eligible after the timer threshold, and the Event Loop runs it when possible.

## 4. Event Loop Phases

Node.js's Event Loop has several phases. For interview purposes, know this structure:

```text
             ┌──────────────┐
             │    Timers     │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │    Pending    │
             │   callbacks   │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │     Poll      │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │     Check     │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │     Close     │
             │   callbacks   │
             └──────┬───────┘
                    ↓
                  Repeat
```

There are also internal idle and prepare phases that you generally do not need to study yet. Node.js's official documentation describes the phases and their callback queues.

## 5. Timers Phase

The timers phase processes callbacks scheduled by:

```js
setTimeout(...);
setInterval(...);
```

For example:

```js
setTimeout(() => {
  console.log("Timer");
}, 1000);
```

After the timer's threshold has passed, the callback can be executed during timer processing.

### Important

`1000` means approximately **at least 1000 ms before the callback becomes eligible**. It does not mean:

> The callback will execute exactly at 1000 ms.

The callback can be delayed by other work running on the JavaScript thread or by operating-system scheduling.

## 6. Pending Callbacks Phase

This phase handles certain callbacks deferred from a previous iteration, including some system-level I/O-related callbacks.

For normal interviews, remember:

> The pending callbacks phase handles certain deferred system and I/O callbacks.

You do not need to memorize obscure examples.

## 7. Poll Phase

The poll phase is one of the most important phases. It has two major responsibilities:

1. Retrieve new I/O events.
2. Execute callbacks for those I/O events.

For example:

```js
fs.readFile("data.txt", callback);
```

When the file operation completes, its callback can be processed as part of the I/O handling around the poll phase.

Conceptually:

```text
Poll phase
    ↓
┌──────────────────┐
│ I/O callback #1  │
│ I/O callback #2  │
│ I/O callback #3  │
└──────────────────┘
```

If there is no immediate work to process, the Event Loop may wait in the poll phase for new I/O events. This is why you should not imagine the Event Loop as continuously spinning at maximum CPU usage.

## 8. Check Phase

The check phase executes `setImmediate()` callbacks.

For example:

```js
setImmediate(() => {
  console.log("Immediate");
});
```

Its callback is executed in the check phase.

The useful mental model is:

```text
Poll
  ↓
Check
  ↓
setImmediate()
```

## 9. Close Callbacks Phase

This phase handles certain close-related events.

For example:

```js
socket.on("close", () => {
  console.log("Socket closed");
});
```

For interviews, remember that the close-callback phase handles certain close events, such as socket cleanup events.

## 10. One Complete I/O Example

Consider this example:

```js
const fs = require("node:fs");

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("timeout");
  }, 0);

  setImmediate(() => {
    console.log("immediate");
  });
});
```

The interesting part is what happens inside the file-read callback.

### Step 1: Start `readFile()`

```text
JavaScript
    ↓
fs.readFile()
    ↓
File operation starts
```

The initial JavaScript does not wait synchronously for the file.

### Step 2: The file operation finishes

The file-read callback becomes ready:

```text
File operation
      ↓
   Complete
      ↓
I/O callback
      ↓
Poll phase
```

### Step 3: Execute the file callback

Inside the callback, both of these are scheduled:

```js
setTimeout(...);
setImmediate(...);
```

### Step 4: Move from poll to check

After the poll phase, Node.js moves to the check phase:

```text
Poll
  ↓
Check
```

The `setImmediate()` callback runs:

```text
Check phase
      ↓
setImmediate()
      ↓
"immediate"
```

### Step 5: Process the timer

The `setTimeout(..., 0)` callback executes when the timer is processed in the appropriate timers phase.

The output is therefore:

```text
immediate
timeout
```

Node.js documentation specifically notes that when both callbacks are scheduled inside an I/O cycle, `setImmediate()` executes first.

## 11. `setTimeout(0)` vs. `setImmediate()`

This is a common interview question.

| API | Scheduling behavior |
| --- | --- |
| `setTimeout(fn, 0)` | Executes the callback after the timer threshold has been reached |
| `setImmediate(fn)` | Executes the callback in the check phase, after the poll phase |

Their relative ordering depends on where they are scheduled:

- In the main module, their order is not guaranteed.
- Inside an I/O callback, `setImmediate()` runs first.

## 12. Microtasks Are Not Event Loop Phases

This distinction matters.

The following are not Event Loop phases like timers, poll, and check:

```js
Promise.resolve().then(...);
queueMicrotask(...);
process.nextTick(...);
```

Node.js processes these high-priority queues between pieces of Event Loop work.

`process.nextTick()` has its own next-tick queue, while the Promise and `queueMicrotask()` callbacks use the microtask queue. In CommonJS execution, Node.js drains the next-tick queue before the microtask queue.

Promises and `process.nextTick()` will be studied separately, so you do not need to memorize all their ordering rules yet.

## 13. A Better Mental Model

Think of Node.js as repeatedly checking different trays:

```text
             Event Loop
                  ↓
        ┌──────────────────┐
        │  Timer callbacks │
        └────────┬─────────┘
                 ↓
        ┌──────────────────┐
        │ Pending callbacks│
        └────────┬─────────┘
                 ↓
        ┌──────────────────┐
        │   I/O / Poll     │
        └────────┬─────────┘
                 ↓
        ┌──────────────────┐
        │  setImmediate()  │
        └────────┬─────────┘
                 ↓
        ┌──────────────────┐
        │  Close callbacks │
        └────────┬─────────┘
                 ↓
               Repeat
```

The Event Loop does not execute all asynchronous operations itself. Instead, asynchronous work completes through underlying runtime and operating-system mechanisms, and the Event Loop determines when the associated JavaScript callbacks can run.

## 14. What Blocks the Event Loop?

Consider:

```js
setTimeout(() => {
  console.log("Timer");
}, 0);

for (let i = 0; i < 10_000_000_000; i++) {
  // CPU-heavy work
}
```

The timer may already be eligible, but its callback cannot run while the JavaScript thread is busy executing the loop.

```text
Main JavaScript thread

CPU-heavy code
██████████████████████████
                         ↓
                    Event Loop
                         ↓
                  Timer callback
                         ↓
                      Finally
```

The Event Loop does not make CPU-heavy JavaScript asynchronous. A callback can execute only when the JavaScript thread is available.

## 15. Interview-Ready Answers

### What is the Event Loop?

The Event Loop is Node.js's mechanism for continuously processing phases of asynchronous work and executing callbacks when they are ready.

### Why is it important?

It allows Node.js to handle asynchronous I/O without blocking the main JavaScript thread while I/O is pending.

### What are the important phases?

Timers, pending callbacks, poll, check, and close callbacks. Idle and prepare are internal phases.

### What happens in the poll phase?

Node.js processes I/O-related callbacks and can wait for new I/O events when appropriate.

### Where does `setImmediate()` execute?

In the check phase.

### Does `setTimeout(fn, 0)` execute immediately?

No. Zero is not an immediate-execution guarantee. The callback becomes eligible after the timer threshold and runs when the Event Loop can process it.

### Is `setImmediate()` always faster than `setTimeout(0)`?

No. Their order depends on where they are scheduled. Inside an I/O callback, `setImmediate()` runs first; from the main module, the order can vary.

## What You Need to Remember

```text
Event Loop
    ↓
Repeatedly processes phases

Timers
    → setTimeout / setInterval

Pending callbacks
    → certain deferred system callbacks

Poll
    → I/O callbacks + waiting for I/O

Check
    → setImmediate

Close callbacks
    → certain close events
```

The most important mental model is:

```text
Async operation
      ↓
Operation completes
      ↓
Callback becomes eligible
      ↓
Event Loop reaches the appropriate point
      ↓
Callback runs on the JavaScript thread
```

That is the interview-level Event Loop understanding you need. The exact phase behavior described here reflects current Node.js documentation. Notably, Node.js 20 changed when timers are processed relative to the poll phase.
