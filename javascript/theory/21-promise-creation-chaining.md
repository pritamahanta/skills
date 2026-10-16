# Creating Promises, Promise Chaining, and Error Handling

## 1. Creating a Promise

A Promise represents the eventual success or failure of an asynchronous operation.

Consider an e-commerce workflow in which an order must be created before payment can begin:

```js
const cart = ["shoes", "pants", "kurta"];

const promise = createOrder(cart);

promise.then(function (orderId) {
  proceedToPayment(orderId);
});
```

This is the **consumer side** of a Promise. It receives the Promise returned by `createOrder()` and attaches a fulfillment handler with `.then()`.

---

## 2. The Promise constructor: `resolve` and `reject`

JavaScript provides the `Promise` constructor for creating Promises:

```js
function createOrder(cart) {
  return new Promise(function (resolve, reject) {
    if (!validateCart(cart)) {
      reject(new Error("Cart is not valid"));
      return;
    }

    const orderId = "12345";

    if (orderId) {
      resolve(orderId);
    }
  });
}
```

The constructor receives a function with two functions:

- `resolve(value)`: fulfills the Promise with a value when the operation succeeds.
- `reject(reason)`: rejects the Promise when the operation fails.

In this example:

1. The cart is validated.
2. If validation fails, the Promise is rejected with an error.
3. If validation succeeds and an order ID exists, the Promise is fulfilled with that ID.

The `return` after `reject()` prevents the remaining order-creation logic from running when validation fails.

### Producer and consumer

| Part | Responsibility |
|---|---|
| Producer | Creates a Promise and settles it with `resolve()` or `reject()`. |
| Consumer | Uses methods such as `.then()` and `.catch()` to handle the result. |

In this example, `createOrder()` is the producer. The code that calls it and attaches handlers is the consumer.

---

## 3. Understanding the Promise object

```js
const promise = createOrder(cart);

console.log(promise);
```

The returned value is a Promise object, not the order ID itself.

A Promise can be in one of three states:

| State | Meaning |
|---|---|
| `pending` | The operation has not settled. |
| `fulfilled` | The operation succeeded. |
| `rejected` | The operation failed. |

An operation may begin with a `pending` Promise and later settle as fulfilled or rejected. A settled Promise cannot change to another state.

> The Promise object does not start as `undefined` and later become the order ID. It remains a Promise; its fulfillment value is delivered to a registered handler.

---

## 4. Handling errors with `.catch()`

If `createOrder()` rejects its Promise, the rejection can be handled with `.catch()`:

```js
createOrder(cart)
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .catch(function (err) {
    console.log(err);
  });
```

- `.then()` handles a fulfillment and receives its value.
- `.catch()` handles a rejection that propagates to it through the chain.
- The error object can be inspected or logged in the catch handler.

Without an appropriate rejection handler, a failed operation may result in an unhandled Promise rejection.

---

## 5. Promise chaining

Promise chaining connects dependent asynchronous operations with successive `.then()` calls.

Suppose the workflow is:

1. Create an order.
2. Proceed to payment.
3. Receive payment information.

```js
createOrder(cart)
  .then(function (orderId) {
    console.log(orderId);
    return orderId;
  })
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .then(function (paymentInfo) {
    console.log(paymentInfo);
  })
  .catch(function (err) {
    console.log(err);
  });
```

Assume `proceedToPayment()` returns a Promise:

```js
function proceedToPayment(orderId) {
  return new Promise(function (resolve, reject) {
    resolve("Payment Successful");
  });
}
```

This example assumes the payment succeeds and fulfills the Promise with `"Payment Successful"`.

### How the chain works

1. `createOrder(cart)` returns a Promise.
2. When it fulfills, the first `.then()` receives the `orderId`.
3. That handler returns the order ID, so the next `.then()` receives it.
4. `proceedToPayment(orderId)` returns another Promise.
5. The following `.then()` receives the payment information when that Promise fulfills.
6. `.catch()` handles a rejection that propagates through the preceding chain.

### Why `return` matters

```js
createOrder(cart)
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .then(function (paymentInfo) {
    console.log(paymentInfo);
  });
```

Because `proceedToPayment()` returns a Promise, the next handler waits for that Promise to settle and receives its fulfillment value.

If the operation is called without returning it:

```js
createOrder(cart)
  .then(function (orderId) {
    proceedToPayment(orderId);
  });
```

The handler returns `undefined`, so the next link would not automatically wait for or receive the result of `proceedToPayment()`.

> Returning a value or Promise from a handler passes the intended result to the next link in the chain.

---

## 6. Where should `.catch()` be placed?

A `.catch()` handler catches a rejection that propagates to it from earlier links in the chain. Its position affects which failures it handles and whether later handlers execute.

### Catch at the end

```js
createOrder(cart)
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .then(function (paymentInfo) {
    console.log(paymentInfo);
  })
  .catch(function (err) {
    console.log(err);
  });
```

A rejection from `createOrder()`, a preceding handler, or `proceedToPayment()` propagates to this catch handler.

### Catch in the middle

```js
createOrder(cart)
  .then(function (orderId) {
    return proceedToPayment(orderId);
  })
  .catch(function (err) {
    console.log(err);
  })
  .then(function (paymentInfo) {
    console.log(paymentInfo);
  });
```

If an earlier operation fails, `.catch()` handles the error. If the catch handler completes normally without throwing or returning a rejected Promise, the chain continues to the following `.then()`.

Because this catch handler only logs the error, it returns `undefined`. The following `.then()` may therefore receive `undefined` instead of valid payment information.

The placement of `.catch()` matters because handling an error can allow the chain to continue, but it does not automatically create the successful result expected by the next operation.

---

## Quick revision

- `new Promise((resolve, reject) => { ... })` creates a Promise.
- `resolve(value)` fulfills a Promise with a value.
- `reject(reason)` rejects a Promise with a reason.
- The producer creates and settles a Promise.
- The consumer attaches handlers to a Promise.
- `.then()` handles fulfillment and returns another Promise.
- `.catch()` handles a rejection that propagates to it.
- Promise chaining connects dependent operations through successive `.then()` calls.
- A handler's return value determines what the next handler receives.
- The placement of `.catch()` affects error handling and later chain execution.

## Core takeaway

Creating Promises gives us control over how asynchronous operations report success or failure. Promise chaining connects dependent operations in a readable sequence, while `.catch()` handles errors at the appropriate point in the chain.
