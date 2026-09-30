# Single-Threaded and Non-Blocking I/O in Node.js

## 1. What Does Single-Threaded Mean?

In a Node.js application, JavaScript code is primarily executed on one **main thread**.

For example:

```js
console.log("A");

function calculate() {
  return 10 + 20;
}

console.log(calculate());

console.log("B");
```

The JavaScript execution happens sequentially on the main thread:

```text
Main JavaScript thread

console.log("A")
      ↓
calculate()
      ↓
console.log(30)
      ↓
console.log("B")
```

Multiple JavaScript threads are not executing these statements simultaneously.

### Important clarification

Single-threaded does **not** mean that Node.js has only one thread in the entire process.

It means that the JavaScript execution model primarily uses one main thread. Node.js can still use other threads internally for certain operations, and developers can explicitly use worker threads.

## 2. Why Is Single-Threaded Execution Useful?

JavaScript code does not have to deal with multiple JavaScript threads modifying the same data simultaneously.

For example:

```js
let count = 0;

count++;
count++;
count++;
```

These operations are executed sequentially on the JavaScript thread.

The important challenge with Node.js is therefore not managing multiple JavaScript threads, but preventing the main thread from becoming blocked.

## 3. What Does “Blocking” Mean?

A **blocking operation** keeps the JavaScript thread occupied until the operation finishes.

For example:

```js
const fs = require("node:fs");

const data = fs.readFileSync("large.txt", "utf8");

console.log(data);
console.log("Done");
```

`readFileSync()` is synchronous.

Conceptually:

```text
Main thread

readFileSync()
     ↓
WAIT
     ↓
File finishes
     ↓
Continue
     ↓
console.log()
```

While the thread is waiting, it cannot execute other JavaScript.

For a server, this is a problem. If another request arrives while the blocking operation is running, it must wait:

```text
Request A
   ↓
Blocking operation
   ↓
████████████████
   ↓
Finishes

Request B
   ↓
Must wait
```

Blocking work can therefore make other requests wait unnecessarily.

## 4. What Does “Non-Blocking” Mean?

With **non-blocking I/O**, Node.js starts the operation without keeping the JavaScript thread waiting for it to finish.

For example:

```js
const fs = require("node:fs");

fs.readFile("large.txt", "utf8", (err, data) => {
  console.log(data);
});

console.log("Done");
```

Conceptually:

```text
Main JavaScript thread
        │
        ├── Start readFile()
        │
        ├── Continue execution
        │
        └── console.log("Done")

File operation
        │
        └── Happens asynchronously
                 ↓
            Completes
                 ↓
           Callback runs
```

The core distinction is:

```text
Blocking:
Start I/O → WAIT → Continue

Non-blocking:
Start I/O → Continue → Handle result later
```

## 5. Why Does This Matter for a Server?

Suppose three requests arrive:

```text
A → Database query
B → Database query
C → Database query
```

A blocking model could look like this:

```text
A → Wait → Finish
B → Wait → Finish
C → Wait → Finish
```

With Node.js's asynchronous model, the operations can be started while the JavaScript thread continues handling other work:

```text
A → Start database operation ─────┐
B → Start database operation ─────┤
C → Start database operation ─────┤
                                  ↓
                       Results become ready
                                  ↓
                       Callbacks / continuations run
```

This is why Node.js is particularly useful for **I/O-bound applications**.

## 6. Non-Blocking Does Not Mean Everything Is Asynchronous

This is an important interview distinction.

Node.js has synchronous APIs such as:

```js
fs.readFileSync();
```

It also has asynchronous APIs such as:

```js
fs.readFile();
```

Therefore, Node.js being a non-blocking runtime does not mean that every Node.js API is automatically non-blocking. Your code can still deliberately block the main thread.

## 7. CPU-Heavy Work Is Different

Consider:

```js
function heavyCalculation() {
  let result = 0;

  for (let i = 0; i < 10_000_000_000; i++) {
    result += i;
  }

  return result;
}
```

This code is not waiting for I/O. The CPU itself is busy executing JavaScript.

Therefore:

```text
CPU-heavy JavaScript
        ↓
Main JavaScript thread stays busy
        ↓
Other JavaScript cannot execute
        ↓
Requests are delayed
```

Non-blocking I/O does not mean that Node.js is immune to blocking.

A more precise statement is:

> Node.js avoids blocking the main JavaScript thread for asynchronous I/O, but CPU-intensive JavaScript can still block that thread.

## 8. The Key Interview Distinction

### I/O-bound tasks

Examples:

- Database queries
- File reads
- Network requests

The program spends significant time waiting for an external resource. Node.js can handle these efficiently using asynchronous I/O.

### CPU-bound tasks

Examples:

- Huge calculations
- Image processing
- Complex data processing

The CPU itself needs to perform substantial computation. If this runs on the main JavaScript thread, it can block the Event Loop.

## 9. Interview-Ready Answers

### What does single-threaded mean in Node.js?

Node.js primarily executes JavaScript on a single main thread. This means JavaScript code is not normally executed simultaneously across multiple JavaScript threads. However, Node.js itself can use other threads internally for certain operations and can also use worker threads.

### What does non-blocking I/O mean?

It means Node.js can start an I/O operation without blocking the main JavaScript thread while waiting for the operation to complete. The thread can continue processing other work, and the result is handled later.

### Why is Node.js good for I/O-heavy applications?

While one operation is waiting for I/O, the main JavaScript thread can continue processing other work instead of remaining blocked.

### Can Node.js still be blocked?

Yes. CPU-intensive JavaScript or synchronous blocking APIs can occupy the main JavaScript thread and prevent other callbacks and requests from being processed.

## Mental Model

```text
                         Node.js

                Main JavaScript thread
                            │
                   ┌────────┴────────┐
                   │                 │
              JavaScript          Async I/O
              execution              │
                   │                 ↓
                   │          OS / internal
                   │            mechanisms
                   │                 │
                   └────────────┬────┘
                                ↓
                           Result ready
                                ↓
                           Event Loop
                                ↓
                   Main JavaScript thread
                   runs callback / continuation
```

## Remember

- **Single-threaded:** JavaScript primarily runs on one main thread.
- **Non-blocking I/O:** The main thread does not wait idly for asynchronous I/O.
- **Blocking:** The main thread cannot move on until the operation finishes.
- **CPU-heavy JavaScript:** It can block the main thread even though Node.js uses non-blocking I/O.