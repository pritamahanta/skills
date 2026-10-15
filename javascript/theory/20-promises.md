# Promises in JavaScript

## 1. What is a Promise?

A **Promise** is a JavaScript object that represents the eventual completion or failure of an asynchronous operation.

It acts as a placeholder for a value that may become available later. While the operation is in progress, JavaScript can continue executing other code instead of waiting synchronously for the result.

### Promise states

| State | Meaning |
|---|---|
| `pending` | The operation has not completed yet. |
| `fulfilled` | The operation completed successfully. |
| `rejected` | The operation failed. |

A Promise settles only once. After it becomes fulfilled or rejected, its state cannot change.

---

## 2. Why do we need Promises?

Consider an e-commerce workflow:

```js
const cart = ["shoes", "pants", "kurta"];
```

The operations depend on one another:

1. Create the order.
2. Proceed to payment.
3. Show the order summary.
4. Update the wallet balance.

Each operation should begin only after the previous operation provides the required result.

### The callback approach

```js
createOrder(cart, function (orderId) {
  proceedToPayment(orderId);
});
```

Here, `createOrder()` receives a callback that should run after the order is created.

The problem is that we depend on `createOrder()` to invoke the callback correctly. It might never invoke it or might invoke it more than once if it is implemented incorrectly.

This is called **Inversion of Control**: we give a function to another function and depend on that function to control when the callback runs.

Promises provide another way to register reactions to the outcome of an asynchronous operation.

---

## 3. How Promises work

Suppose `createOrder()` returns a Promise:

```js
const cart = ["shoes", "pants", "kurta"];

const promiseRef = createOrder(cart);

promiseRef.then(function (orderId) {
  proceedToPayment(orderId);
});
```

Assume the Promise fulfills with the created order's ID.

The sequence is:

1. `createOrder(cart)` starts the operation and returns a Promise.
2. The Promise may initially be `pending` because the order has not been created yet.
3. `.then()` registers a handler for the fulfilled result.
4. When the Promise fulfills, the handler receives the `orderId`.
5. `proceedToPayment(orderId)` runs with that value.

JavaScript can continue executing other code while the order is being created.

> The Promise object does not start as `undefined` and later become the order ID. The Promise object is returned immediately, and its eventual fulfillment value is delivered to the registered handler.

### Why this is useful

With callbacks, a function is passed to another function, and we rely on the receiving function to invoke it correctly.

With Promises, a handler is attached using `.then()` to the Promise representing the operation's outcome. Because a Promise settles only once, its outcome is not completed multiple times.

---

## 4. Working with a real Promise using `fetch()`

The browser's `fetch()` API returns a Promise.

```js
const URL = "https://api.github.com/users/alok722";

const user = fetch(URL);

console.log(user);
```

`fetch()` starts the request and immediately returns a Promise instead of waiting for the network response.

While the request is in progress, the Promise is typically `pending`.

### Understanding the Promise result

Browser DevTools may show internal Promise information such as:

- **Promise state:** whether the Promise is `pending`, `fulfilled`, or `rejected`
- **Promise result:** the value associated with the settled state

A pending Promise does not yet have a fulfillment result. If the request succeeds, the Promise returned by `fetch()` fulfills with a `Response` object.

The response body is not automatically converted into a JavaScript object by `fetch()`.

### Handling the result with `.then()`

```js
const URL = "https://api.github.com/users/alok722";

const user = fetch(URL);

user.then(function (response) {
  console.log(response);
});
```

The handler runs when the Promise fulfills and receives the `Response` object. `.then()` lets us register this handler without manually checking whether the request has finished.

---

## 5. Promise chaining

Promises can help avoid **Callback Hell**, where dependent asynchronous operations create deeply nested callbacks.

### Callback-based workflow

```js
createOrder(cart, function (orderId) {
  proceedToPayment(orderId, function (paymentInfo) {
    showOrderSummary(paymentInfo, function (balance) {
      updateWalletBalance(balance);
    });
  });
});
```

Each callback contains another callback. As dependent operations increase, the code becomes deeply nested, sometimes called the Pyramid of Doom.

### Promise-based workflow

```js
createOrder(cart)
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .then(function (paymentInfo) {
    return showOrderSummary(paymentInfo);
  })
  .then(function (balance) {
    return updateWalletBalance(balance);
  });
```

Each `.then()` receives the result returned by the previous handler, provided that handler returns the required value or Promise.

### Why `return` matters

```js
.then(function (orderId) {
  return proceedToPayment(orderId);
})
```

The returned value becomes the fulfillment value for the next link in the chain. If `proceedToPayment()` returns a Promise, the next `.then()` waits for that Promise to settle and receives its fulfillment value.

The same rule applies to the other operations in the chain.

For example:

```js
createOrder(cart)
  .then(function (orderId) {
    proceedToPayment(orderId);
  });
```

Here, the handler does not return the result of `proceedToPayment()`. Therefore, the next link in the chain would not automatically receive that operation's result.

---

## Quick revision

- A Promise represents the eventual completion or failure of an asynchronous operation.
- Its states are `pending`, `fulfilled`, and `rejected`.
- `.then()` registers a handler for a Promise's fulfillment and can also register a rejection handler.
- Inversion of Control occurs when we depend on another function to invoke a callback correctly.
- `fetch()` returns a Promise that fulfills with a `Response` when the response is available.
- Callback Hell is deeply nested callback code for dependent operations.
- Promise chaining connects dependent operations with successive `.then()` calls.
- Returning a value or Promise passes the result to the next handler in the chain.
- A Promise settles only once.

## Core takeaway

Promises represent the outcomes of asynchronous operations and let us register handlers with `.then()`. They reduce dependence on manually managed callbacks and make sequential asynchronous workflows easier to read through Promise chaining.
