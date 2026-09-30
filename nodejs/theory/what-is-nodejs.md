# What Is Node.js?

## Definition

Node.js is an **open-source, cross-platform JavaScript runtime** built on Google's **V8 JavaScript engine**.

It allows JavaScript to run outside the browser and provides APIs for:

- Networking
- Filesystem access
- Processes
- Other system-level operations

Node.js is designed around **asynchronous, non-blocking I/O** and an **event-driven model**, making it well suited for I/O-heavy backend and network applications.

## 1. Node.js Is a JavaScript Runtime

A **runtime environment** is the environment in which a program is executed and given the facilities it needs to run.

JavaScript is a programming language. To execute JavaScript, an environment containing a JavaScript engine is required.

### In a browser

```text
Browser
   ↓
JavaScript engine + browser APIs
   ↓
JavaScript runs
```

### With Node.js

```text
Node.js
   ↓
V8 engine + Node.js APIs
   ↓
JavaScript runs
```

Node.js therefore allows JavaScript to run without requiring a browser.

## 2. Node.js Uses the V8 Engine

**V8** is Google's JavaScript engine. It is used by Chrome and by Node.js to execute JavaScript.

```js
const x = 10;
console.log(x);
```

Node.js uses V8 to execute this JavaScript code.

| Term | Meaning |
| --- | --- |
| JavaScript | Programming language |
| V8 | JavaScript engine |
| Node.js | Runtime environment that uses V8 |

## 3. What Does Node.js Add to JavaScript?

Running JavaScript alone is not enough for a backend application. A backend may need to:

- Read files
- Create network servers
- Accept HTTP requests
- Access operating-system information
- Work with processes
- Communicate over sockets

Node.js provides APIs for these operations:

```js
const fs = require("node:fs");      // Filesystem
const http = require("node:http"); // HTTP

console.log(process.env.PORT);      // Process/environment
```

These APIs are provided by Node.js, not by the JavaScript language itself.

Node.js's standard library includes APIs for areas such as:

- HTTP
- Filesystem operations
- Streams
- Processes
- Cryptography
- And more

## 4. Why Is Node.js Commonly Used for Backend Development?

One of Node.js's important characteristics is its **asynchronous, non-blocking I/O model**.

Suppose a server needs to read data from a database:

```text
Request
   ↓
Database query
   ↓
Wait for database
   ↓
Continue after result arrives
```

Node.js does not normally block JavaScript execution while waiting for an I/O operation, such as filesystem, network, or database-related work. Instead, the operation can proceed asynchronously. Node.js can continue processing other work and handle the result when it becomes available.

This is one of the main reasons Node.js is well suited for I/O-heavy network applications.

## 5. Is Node.js Single-Threaded?

The safe answer is:

> Node.js executes JavaScript on a main thread, but Node.js itself is not limited to only one thread. It can use underlying system mechanisms and worker threads for certain operations.

The important point is:

```text
JavaScript execution
        ↓
Main thread
```

Asynchronous I/O can be handled without blocking that JavaScript execution.

The Node.js documentation describes a Node.js application as running in a single process and explains that its asynchronous I/O primitives prevent JavaScript code from blocking.

## 6. What Does “Non-Blocking” Mean?

Consider this simplified example:

```js
const data = readFile();
```

Imagine that `readFile()` takes two seconds.

### Blocking approach

```text
JavaScript
   ↓
Read file
   ↓
WAIT 2 seconds
   ↓
Continue
```

During the wait, execution is blocked.

### Node.js's asynchronous approach

```text
JavaScript
   ↓
Start I/O
   ↓
Continue doing other work
   ↓
I/O finishes
   ↓
Handle result
```

**Non-blocking** does not mean that a file, database, or network operation is instantaneous. It means JavaScript execution does not have to remain blocked while waiting for the I/O operation to complete.

## 7. What Can We Build with Node.js?

Because Node.js provides networking and other system APIs, it can be used to build:

- REST APIs
- Web servers
- Backend services
- Real-time applications
- CLI tools
- Network applications
- Microservices