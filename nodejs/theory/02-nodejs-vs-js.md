# Node.js vs. JavaScript

## 1. JavaScript

JavaScript is a **programming language**.

The language defines features such as:

```js
let x = 10;

function add(a, b) {
  return a + b;
}

const user = {
  name: "Pritam",
};

const promise = Promise.resolve(10);
```

These are JavaScript language features:

- Variables
- Functions
- Objects
- Arrays
- Classes
- Loops
- Promises
- `async`/`await`
- Operators
- Data types

JavaScript itself does not define capabilities such as:

- Reading a file
- Creating an HTTP server
- Accessing the operating system
- Creating a TCP server

Those capabilities come from the environment in which JavaScript runs.

## 2. Node.js

Node.js is a **runtime environment for executing JavaScript outside the browser**.

Node.js uses the V8 JavaScript engine to execute JavaScript and provides additional APIs for server-side and system-level operations.

For example:

```js
const fs = require("node:fs");

fs.readFile("data.txt", "utf8", (err, data) => {
  console.log(data);
});
```

In this example:

```text
JavaScript
    ↓
Node.js runtime
    ↓
V8 executes JavaScript
    +
Node.js provides the fs API
    ↓
File is read
```

`fs` is provided by Node.js. It is not a feature of the JavaScript language itself.

## 3. Browser JavaScript vs. Node.js

JavaScript can run in different environments. Each environment provides its own APIs.

### In a browser

The browser provides APIs such as:

```js
document.querySelector(...);
fetch(...);
localStorage.setItem(...);
```

These APIs are provided by the browser environment.

### In Node.js

Node.js provides APIs such as:

```js
fs.readFile(...);
http.createServer(...);
process.env;
path.join(...);
```

These APIs are provided by Node.js.

The relationship can be summarized like this:

```text
                       JavaScript
                      /          \
                 Browser       Node.js
                    |             |
             Browser APIs     Node.js APIs
             DOM, fetch,      fs, http,
             localStorage     process, path
```

The JavaScript language remains the same, but the available environment-specific APIs are different.

## 4. Why Can JavaScript Run on a Server?

JavaScript itself does not become a server-side language.

Instead, a runtime such as Node.js provides the environment needed to perform server-side operations.

For example:

```js
const http = require("node:http");

const server = http.createServer((req, res) => {
  res.end("Hello");
});

server.listen(3000);
```

The code is JavaScript. Node.js provides:

- `http`
- `createServer()`
- `server.listen()`

V8 executes the JavaScript, while Node.js provides the APIs that allow the code to create and run a server.

Therefore, Node.js allows JavaScript to be used for backend and server-side development.

## 5. The Important Difference

| JavaScript | Node.js |
| --- | --- |
| Programming language | Runtime environment |
| Defines the language syntax and behavior | Provides an environment to execute JavaScript |
| Is not itself a server runtime | Can be used to build servers |
| Does not provide APIs such as `fs` | Provides APIs such as `fs`, `http`, `path`, and `process` |
| Can run in browsers and other runtimes | Runs JavaScript outside the browser |

## 6. Interview Answer

### What is the difference between JavaScript and Node.js?

JavaScript is a programming language, while Node.js is a runtime environment that allows JavaScript to run outside the browser. Node.js uses the V8 JavaScript engine and provides additional APIs such as `fs`, `http`, and `process` for backend and system-level operations.