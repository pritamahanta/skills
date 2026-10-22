# Async/Await in JavaScript

## 1. What does `async` do?

`async` before a function declaration makes it an **async function**. An async function always returns a Promise.

```js
async function getData() {
  return "Namaste JavaScript";
}

const dataPromise = getData();

console.log(dataPromise);
// Promise fulfilled with "Namaste JavaScript"
```

Although the function returns a string, JavaScript wraps that value in a fulfilled Promise. The value can be accessed with `.then()`:

```js
dataPromise.then((res) => console.log(res));
// Namaste JavaScript
```

### Returning an existing Promise

If an async function returns a Promise, the Promise returned by the async function adopts that Promise's eventual outcome:

```js
const p = new Promise((resolve) => {
  resolve("Promise resolved value!!");
});

async function getData() {
  return p;
}

getData().then((res) => console.log(res));
// Promise resolved value!!
```

---

## 2. What does `await` do?

`await` is used inside an async function. It suspends that function until the awaited Promise settles, then allows the function to continue.

For a fulfilled Promise, `await` evaluates to its fulfillment value:

```js
const p = new Promise((resolve) => {
  resolve("Promise resolved value!!");
});

async function handlePromise() {
  const val = await p;
  console.log(val);
}

handlePromise();
// Promise resolved value!!
```

The same result can be handled with `.then()`:

```js
function getData() {
  p.then((res) => console.log(res));
}

getData();
// Promise resolved value!!
```

---

## 3. `.then()` vs. `async/await`

Consider a Promise that fulfills after three seconds:

```js
const p = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Promise resolved value!!");
  }, 3000);
});
```

### Using `.then()`

```js
function getData() {
  p.then((res) => console.log(res));
  console.log("Hello There!");
}

getData();
```

Output:

```text
Hello There!
Promise resolved value!!
```

`"Hello There!"` is printed immediately. The `.then()` handler runs when the Promise fulfills approximately three seconds later.

### Using `async/await`

```js
async function handlePromise() {
  const val = await p;

  console.log("Hello There!");
  console.log(val);
}

handlePromise();
```

Output after approximately three seconds:

```text
Hello There!
Promise resolved value!!
```

The statements after `await` run only when the awaited Promise fulfills.

### Does `await` block JavaScript?

No. It suspends the async function, not the JavaScript call stack:

1. The async function reaches `await`.
2. If the Promise is pending, that function suspends.
3. Other JavaScript work can continue.
4. When the Promise settles, the function resumes from the suspended point.

This makes asynchronous code easier to read without blocking the main thread.

---

## 4. Using multiple `await` statements

### Awaiting the same Promise

```js
const p = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Promise resolved value!!");
  }, 3000);
});

async function handlePromise() {
  console.log("Hi");

  const val = await p;
  console.log("Hello There!");
  console.log(val);

  const val2 = await p;
  console.log("Hello There! 2");
  console.log(val2);
}

handlePromise();
```

Output:

```text
Hi
Hello There!
Promise resolved value!!
Hello There! 2
Promise resolved value!!
```

The first log appears immediately. After approximately three seconds, the remaining logs run in order. The second `await` does not wait another three seconds because `p` has already fulfilled.

### Awaiting different Promises

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Promise resolved value by p1!!");
  }, 3000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Promise resolved value by p2!!");
  }, 2000);
});

async function handlePromise() {
  console.log("Hi");

  const val = await p1;
  console.log("Hello There!");
  console.log(val);

  const val2 = await p2;
  console.log("Hello There! 2");
  console.log(val2);
}

handlePromise();
```

Both Promises are created before `handlePromise()` is called, so both timers start immediately.

Although `p2` fulfills after two seconds, the function does not process its value until it resumes after `await p1`, which takes three seconds. Because `p2` has already fulfilled by then, the second `await` continues without another two-second wait.

> Promise creation starts the underlying operation. `await` controls when the async function continues; it does not start the Promise.

---

## 5. Starting the second operation later

To start the second asynchronous operation only after the first completes, create its Promise inside a function and call that function after the first `await`:

```js
function createP1() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("p1 resolved"), 3000);
  });
}

function createP2() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("p2 resolved"), 2000);
  });
}

async function handlePromise() {
  console.log("Hi");

  const val1 = await createP1();
  console.log(val1);

  const val2 = await createP2();
  console.log(val2);
}

handlePromise();
```

Here, `createP2()` is not called until `createP1()` fulfills. The second timer therefore starts only after the first operation completes.

Output sequence:

```text
Hi
p1 resolved
p2 resolved
```

The first result appears after approximately three seconds, and the second appears approximately two seconds later.

---

## 6. How `await` controls execution

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("p1 resolved");
  }, 5000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("p2 resolved");
  }, 10000);
});

async function handlePromise() {
  console.log("Hi");

  const val = await p1;
  console.log("Hello There!");
  console.log(val);

  const val2 = await p2;
  console.log("Hello There! 2");
  console.log(val2);
}

handlePromise();
```

Execution order:

1. Both Promises are created, starting their timers.
2. `handlePromise()` prints `"Hi"`.
3. The function reaches `await p1` and suspends because `p1` is pending.
4. After approximately five seconds, `p1` fulfills and the function resumes.
5. The function prints the result from `p1` and reaches `await p2`.
6. When `p2` fulfills, the function resumes and prints the remaining output.

If `p1` takes longer than `p2`, the function still waits at `await p1`. When it eventually resumes, `p2` may already be fulfilled, so `await p2` can continue immediately.

This separates two ideas:

- when a Promise's operation settles, and
- when an async function reaches and resumes from its `await` expression.

---

## 7. Using `fetch()` with `async/await`

`fetch()` returns a Promise that fulfills with a `Response` object when the response is available. The response body can then be parsed with `json()`, which also returns a Promise.

```js
async function handlePromise() {
  const data = await fetch(
    "https://api.github.com/users/alok722"
  );

  const res = await data.json();

  console.log(res);
}

handlePromise();
```

- The first `await` produces the `Response` object.
- The second `await` produces the parsed JSON value.

---

## 8. Error handling with `async/await`

A rejected Promise awaited inside a `try` block transfers control to its `catch` block:

```js
async function handlePromise() {
  try {
    const data = await fetch(
      "https://api.github.com/users/alok722"
    );

    const res = await data.json();

    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

handlePromise();
```

An async function returns a Promise, so its rejection can also be handled outside the function:

```js
handlePromise().catch((err) => console.log(err));
```

---

## 9. `async/await` vs. Promise chaining

| Promise chaining | `async/await` |
|---|---|
| Uses `.then()` to handle fulfillment. | Uses `await` to obtain the fulfillment value. |
| Connects dependent operations through chained handlers. | Writes dependent operations as sequential statements. |
| Uses `.catch()` for propagated rejections. | Uses `try...catch` or `.catch()` on the returned Promise. |

Both approaches use Promises. `async/await` does not replace Promises; it provides another syntax for writing Promise-based asynchronous code.

---

## Quick revision

- `async` declares a function that always returns a Promise.
- `await` suspends an async function until the awaited Promise settles.
- For a fulfilled Promise, `await` evaluates to its fulfillment value.
- Suspending an async function at `await` does not block the JavaScript call stack.
- A Promise's operation can begin before the Promise is awaited.
- Sequential `await` expressions resume the function in code order.
- `fetch()` and `response.json()` return Promises in the example.
- Use `try...catch` or `.catch()` on the returned Promise for error handling.
- `async/await` makes Promise-based asynchronous code easier to read.

## Core takeaway

`async/await` provides a readable way to work with Promises. An async function can suspend at `await` without blocking JavaScript, then resume when the awaited Promise settles. To predict execution order, distinguish when a Promise starts, when it settles, and when the async function resumes.
