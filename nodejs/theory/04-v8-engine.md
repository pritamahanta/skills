# V8: The JavaScript Engine

Node.js uses V8. The key is understanding exactly what V8 does and what it does not do.

## 1. What Is V8?

V8 is Google's open-source **JavaScript engine**. It executes JavaScript code.

Node.js uses V8 as its JavaScript execution engine.

```text
Your JavaScript
      ↓
     V8
      ↓
JavaScript execution
```

V8 is also the engine used by the Chrome browser.

## 2. What Does V8 Actually Do?

Suppose you write:

```js
const a = 10;
const b = 20;

console.log(a + b);
```

V8 takes this JavaScript source code and makes it executable.

A simplified view is:

```text
JavaScript source code
        ↓
      Parsing
        ↓
Internal representation
        ↓
     Execution
```

Modern V8 uses techniques including interpretation and **Just-In-Time (JIT) compilation** to execute JavaScript efficiently.

For a normal Node.js interview, you do not need to learn the internals of V8's compiler pipeline.

## 3. What Is JIT Compilation?

**JIT** means **Just-In-Time compilation**.

Instead of treating all JavaScript as permanently interpreted code, V8 can compile JavaScript into machine code while the program is running, particularly when code becomes worth optimizing.

Conceptually:

```text
JavaScript
    ↓
V8
    ↓
Execute / optimize
    ↓
Machine code
    ↓
CPU
```

The purpose of JIT compilation is better execution performance.

## 4. Interpreted vs. Compiled Code

There are two traditional ways to execute a program.

### Interpreted code

An **interpreter executes code at runtime** instead of first producing a complete native executable.

```text
Source code
  ↓
Interpreter
  ↓
Execute
```

The interpreter reads and executes the program during runtime.

### Compiled code

A **compiler translates source code into machine code before execution**.

```text
Source code
  ↓
Compiler
  ↓
Machine code
  ↓
CPU executes
```

A typical C++ workflow looks like this:

```text
C++ code
   ↓
Compiler
   ↓
Machine code / executable
   ↓
Run executable
```

### Where does JavaScript fit?

JavaScript is often described as an **interpreted language**, but that description is too simplistic for modern JavaScript engines.

Modern engines such as V8 use a combination of interpretation and JIT compilation:

```text
JavaScript source
    ↓
   V8
    ↓
   Interpreter
    ↓
   Execute code
    ↓
Frequently executed code
    ↓
   JIT compilation
    ↓
 Optimized machine code
```

Therefore, JavaScript should not be described as purely interpreted or purely compiled. The engine can execute JavaScript through an interpreter and optimize frequently executed code by compiling it to machine code during runtime.

### Interview answer

> JavaScript engines such as V8 use both interpretation and Just-In-Time compilation. V8 can execute JavaScript through its interpreter and optimize frequently executed code by compiling it to machine code during runtime.

## 5. Does V8 Handle Node.js APIs?

No. This distinction is important.

Consider:

```js
const fs = require("node:fs");

fs.readFile("data.txt", callback);
```

V8 executes the JavaScript and the calls made from it. However, filesystem functionality is provided by Node.js, not by V8.

| Component | Responsibility |
| --- | --- |
| V8 | Executes JavaScript |
| Node.js | Provides APIs such as `fs`, `http`, and `process` |

## 6. Does V8 Handle the Event Loop?

No.

The Event Loop is part of Node.js's asynchronous runtime infrastructure, involving Node.js and libuv.

| Component | Responsibility |
| --- | --- |
| V8 | JavaScript execution |
| Node.js and libuv | Event Loop and asynchronous I/O infrastructure |

This distinction is frequently tested in interviews.

## 7. V8 and Memory

V8 manages the memory needed by JavaScript objects and performs garbage collection.

For example:

```js
let user = {
  name: "Pritam",
};

user = null;
```

The object may eventually become eligible for garbage collection because there is no longer a reference to it.

V8's garbage collector reclaims memory that is no longer needed.

### Interview-level takeaway

V8 manages JavaScript memory and performs garbage collection automatically.

You do not need to study garbage-collection algorithms yet.