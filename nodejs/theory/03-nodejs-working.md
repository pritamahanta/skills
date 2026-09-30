# How Node.js Works

## 1. The Main Components

The basic relationship between your code and the operating system looks like this:

```text
Your JavaScript code
        ↓
      Node.js
   ┌────┴────┐
   ↓         ↓
  V8       Node.js APIs
             ↓
           libuv
             ↓
       OS / worker pool
```

### V8

V8 executes your JavaScript code.

### Node.js APIs

Node.js APIs expose functionality such as:

- `fs.readFile()`
- `http.createServer()`
- `crypto` APIs

### libuv

libuv provides the underlying asynchronous infrastructure, including the **Event Loop** and **worker pool**.

## 2. What Happens When a Node.js Application Starts?

Suppose an application contains:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

When you run the application with:

```bash
node app.js
```

Node.js generally:

1. Starts the Node.js process.
2. Loads and initializes the application.
3. Begins executing the JavaScript with V8.
4. Executes synchronous JavaScript immediately.
5. Registers asynchronous work.
6. Enters the Event Loop.
7. Executes the corresponding callback when asynchronous work becomes ready.
8. Exits when no work remains to keep the process alive.

Conceptually:

```text
Start process
     ↓
Initialize application
     ↓
Execute synchronous JavaScript
     ↓
Register asynchronous operations
     ↓
Enter Event Loop
     ↓
Handle completed events / callbacks
     ↓
No remaining work?
     ↓
Exit
```

## 3. Example: An Asynchronous File Operation

Consider:

```js
const fs = require("node:fs");

console.log("A");

fs.readFile("data.txt", "utf8", (err, data) => {
  console.log("B");
});

console.log("C");
```

The important flow is:

```text
                    Node.js
                       ↓
                Execute JavaScript
                       ↓
                      "A"
                       ↓
                  fs.readFile()
                       ↓
              Start asynchronous I/O
                       ↓
                JavaScript continues
                       ↓
                      "C"
                       ↓
                   Event Loop
                       ↓
              File operation completes
                       ↓
                Callback is executed
                       ↓
                      "B"
```

So the output is generally:

```text
A
C
B
```

The important concept is that `fs.readFile()` does not make JavaScript execution wait synchronously for the file operation to finish. Node.js filesystem APIs use libuv's worker pool for asynchronous filesystem operations.

## 4. Where Does the Event Loop Fit?

The **Event Loop** orchestrates when JavaScript callbacks are executed and handles non-blocking asynchronous operations.

A simplified flow is:

```text
Async operation starts
        ↓
Operation handled by OS / libuv
        ↓
Operation completes
        ↓
Callback becomes ready
        ↓
Event Loop
        ↓
Callback executes on JavaScript thread
```

The exact Event Loop phases and ordering rules are a separate topic. They can be studied in detail next.

## 5. What Does the Worker Pool Do?

Some asynchronous operations cannot simply be handed to an operating-system non-blocking interface. Node.js and libuv can use a worker pool for these operations.

Examples include asynchronous:

- Filesystem operations
- Certain cryptographic operations
- `dns.lookup()`
- `zlib` operations

The worker performs the task. When it finishes, the result becomes available for Node.js to handle through the Event Loop.

Conceptually:

```text
JavaScript
    ↓
Node.js API
    ↓
libuv
    ↓
Worker pool
    ↓
Task completes
    ↓
Event Loop
    ↓
JavaScript callback
```

## 6. One Complete Request Flow

For a backend server, the complete flow can be understood like this:

```text
Client
   ↓
HTTP request
   ↓
Node.js
   ↓
JavaScript request handler
   ↓
Database / file / network operation
   ↓
Asynchronous operation
   ↓
OS or libuv worker pool
   ↓
Operation completes
   ↓
Event Loop
   ↓
Callback / Promise continuation
   ↓
JavaScript
   ↓
HTTP response
   ↓
Client
```

This is the core working model to understand.

## 7. Important Interview Point

An interviewer may ask:

> If Node.js executes JavaScript on one main thread, how can it handle many requests?

A good answer is:

> Node.js executes JavaScript callbacks on the main thread, but it does not synchronously wait for I/O operations. Asynchronous I/O is handled through the operating system or libuv's worker pool. When the operation completes, the Event Loop schedules the corresponding callback to run. This allows one Node.js process to handle many concurrent I/O operations without creating a dedicated JavaScript thread for each request.