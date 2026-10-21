# Promise APIs in JavaScript

JavaScript provides several static Promise APIs for handling multiple Promises:

- `Promise.all()`
- `Promise.allSettled()`
- `Promise.race()`
- `Promise.any()`

They differ in when the returned Promise settles and how it handles fulfillment and rejection.

## 1. Example Promises

The examples use three independent asynchronous operations:

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("P1 Success"), 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("P2 Success"), 1000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("P3 Success"), 2000);
});
```

Here, `p1`, `p2`, and `p3` fulfill after approximately 3, 1, and 2 seconds.

---

## 2. `Promise.all()`

`Promise.all()` accepts an iterable of Promises and returns a new Promise that fulfills only when **all input Promises fulfill**.

The results are returned in the same order as the input Promises, regardless of the order in which they finish.

### When all Promises fulfill

```js
Promise.all([p1, p2, p3])
  .then((results) => {
    console.log(results);
  })
  .catch((err) => {
    console.error(err);
  });
```

Output after approximately 3 seconds:

```js
[
  "P1 Success",
  "P2 Success",
  "P3 Success"
]
```

It waits for the slowest input Promise before returning the complete results.

### When one Promise rejects

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve("P1 Success"), 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => reject("P2 Fail"), 1000);
});

const p3 = new Promise((resolve) => {
  setTimeout(() => resolve("P3 Success"), 2000);
});

Promise.all([p1, p2, p3])
  .then((results) => console.log(results))
  .catch((err) => console.error(err));
```

After approximately 1 second, the catch handler receives `"P2 Fail"`.

`Promise.all()` rejects as soon as an input Promise rejects. It does not cancel the remaining operations; they may continue running.

**Use it when:** every result is required for the operation to succeed, such as processing several API responses together.

---

## 3. `Promise.allSettled()`

`Promise.allSettled()` waits until **every input Promise has settled**, whether fulfilled or rejected.

A rejected input does not cause the aggregate Promise to reject.

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve("P1 Success"), 3000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => resolve("P2 Success"), 1000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => reject("P3 Fail"), 2000);
});

Promise.allSettled([p1, p2, p3])
  .then((results) => console.log(results));
```

Output after approximately 3 seconds:

```js
[
  { status: "fulfilled", value: "P1 Success" },
  { status: "fulfilled", value: "P2 Success" },
  { status: "rejected", reason: "P3 Fail" }
]
```

Each result object corresponds to an input Promise and remains in input order:

- A fulfilled result contains a `value`.
- A rejected result contains a `reason`.

**Use it when:** you need the outcome of every operation, including failures.

---

## 4. `Promise.race()`

`Promise.race()` returns a Promise that settles as soon as the first input Promise settles.

The first settled Promise may fulfill or reject.

### First settlement is fulfillment

Using the original `p1`, `p2`, and `p3`:

```js
Promise.race([p1, p2, p3])
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

Output after approximately 1 second:

```text
P2 Success
```

`p2` fulfills first, so its value determines the result.

### First settlement is rejection

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve("P1 Success"), 3000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => resolve("P2 Success"), 5000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => reject("P3 Fail"), 2000);
});

Promise.race([p1, p2, p3])
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

Output after approximately 2 seconds:

```text
P3 Fail
```

The rejection from `p3` settles the returned Promise because it occurs first.

**Use it when:** the earliest outcome, whether success or failure, should determine the result.

---

## 5. `Promise.any()`

`Promise.any()` returns a Promise that fulfills when the **first input Promise fulfills**.

It ignores individual rejections while waiting for a successful result.

### An early rejection followed by success

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve("P1 Success"), 3000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => resolve("P2 Success"), 5000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => reject("P3 Fail"), 2000);
});

Promise.any([p1, p2, p3])
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

Output after approximately 3 seconds:

```text
P1 Success
```

Although `p3` rejects after 2 seconds, `Promise.any()` continues waiting. When `p1` fulfills after 3 seconds, its result is returned.

### When every Promise rejects

```js
const p1 = Promise.reject("P1 Fail");
const p2 = Promise.reject("P2 Fail");
const p3 = Promise.reject("P3 Fail");

Promise.any([p1, p2, p3])
  .then((result) => console.log(result))
  .catch((err) => {
    console.error(err);
    console.error(err.errors);
  });
```

If every input rejects, the returned Promise rejects with an `AggregateError`. Its `errors` property contains the input rejection reasons in input order.

**Use it when:** the first successful result is sufficient and individual failures are acceptable, such as trying several alternative sources.

---

## 6. `Promise.resolve()` and `Promise.reject()`

These static methods create already-settled Promises.

### `Promise.resolve()`

`Promise.resolve()` creates a fulfilled Promise with the supplied value. If the value is already a Promise or thenable, the returned Promise adopts its eventual outcome.

```js
Promise.resolve("Success")
  .then((value) => console.log(value));
```

Output:

```text
Success
```

### `Promise.reject()`

`Promise.reject()` creates a rejected Promise with the supplied reason.

```js
Promise.reject("Something went wrong")
  .catch((err) => console.log(err));
```

Output:

```text
Something went wrong
```

These methods are useful when an already-fulfilled or already-rejected Promise is needed.

---

## 7. Comparing the main Promise APIs

| API | Returned Promise settles when | If an input rejects |
|---|---|---|
| `Promise.all()` | All inputs fulfill. | Rejects as soon as one input rejects. |
| `Promise.allSettled()` | All inputs settle. | Records the rejection and continues waiting. |
| `Promise.race()` | The first input settles. | Rejects if the first settled input rejects. |
| `Promise.any()` | The first input fulfills, or all inputs reject. | Ignores individual rejections while waiting for fulfillment. |

### Easy way to remember

- **`all`**: every Promise must fulfill.
- **`allSettled`**: collect every outcome.
- **`race`**: the first settled outcome wins.
- **`any`**: the first successful outcome wins.

## Core takeaway

Choose:

- `Promise.all()` when every operation must succeed.
- `Promise.allSettled()` when every outcome matters.
- `Promise.race()` when the earliest outcome determines the result.
- `Promise.any()` when the first successful result is sufficient.
