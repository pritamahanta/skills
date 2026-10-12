# Callback Functions, Callback Hell, and Inversion of Control

## 1. Callback Functions

A **callback function** is a function passed to another function so that the receiving function can invoke it later or when an operation is ready.

JavaScript executes ordinary code synchronously on a single Call Stack, but callbacks allow code to respond to asynchronous operations.

### Synchronous execution

```javascript
console.log("Namaste");
console.log("JavaScript");
console.log("Season 2");
```

Output:

```text
Namaste
JavaScript
Season 2
```

The statements execute in order.

### Callback with `setTimeout`

```javascript
console.log("Namaste");

setTimeout(function () {
  console.log("JavaScript");
}, 5000);

console.log("Season 2");
```

Output:

```text
Namaste
Season 2
JavaScript
```

The timer callback runs later, after the timer is ready and the Call Stack can process it.

```text
Operation registered
      ↓
JavaScript continues
      ↓
Operation becomes ready
      ↓
Callback executes
```

---

## 2. Callbacks for Dependent Operations

Consider an e-commerce workflow:

```javascript
const cart = ["shoes", "pants", "kurta"];
```

Creating an order must finish before payment begins. This does not express that dependency:

```javascript
api.createOrder(cart);
api.proceedToPayment();
```

The calls appear in order, but `createOrder()` may be asynchronous. Payment could begin before order creation has completed.

Pass a callback to make the dependency explicit:

```javascript
api.createOrder(cart, function () {
  api.proceedToPayment();
});
```

The intended contract is:

```text
createOrder starts
      ↓
order creation completes
      ↓
callback runs
      ↓
proceedToPayment starts
```

This works only if `createOrder()` correctly invokes the callback after the order is created.

---

## 3. Callback Hell

Suppose the complete workflow is:

1. Create the order.
2. Proceed to payment.
3. Show the order summary.
4. Update the wallet.

With nested callbacks:

```javascript
api.createOrder(cart, function () {
  api.proceedToPayment(function () {
    api.showOrderSummary(function () {
      api.updateWallet();
    });
  });
});
```

Each operation starts inside the callback of the previous operation. As dependencies increase, the code becomes deeply nested.

This is called **Callback Hell**, also known as the **Pyramid of Doom**.

### Why it is a problem

- **Readability:** deep indentation makes the flow harder to follow.
- **Maintenance:** adding or changing a step becomes more difficult.
- **Control flow:** dependencies and error handling become harder to manage.

```text
A completes
  ↓
B completes
  ↓
C completes
  ↓
D completes
```

The dependency may be correct, but the nested structure becomes difficult to work with.

---

## 4. Inversion of Control

**Inversion of Control (IoC)** occurs when we give a callback to another function and depend on that function to invoke it correctly.

```javascript
api.createOrder(cart, function () {
  api.proceedToPayment();
});
```

We no longer control directly when the callback runs. We rely on `createOrder()` to honor the expected callback contract.

### What could go wrong?

If the receiving function is incorrectly implemented, it might:

- never invoke the callback
- invoke it more than once
- invoke it too early
- invoke it at an inappropriate time

As a result, payment might never begin, or it might begin multiple times or before the order exists.

This risk is greater when the callback-based function is maintained by another developer or comes from an external library.

```text
Your code provides callback
        ↓
Other function controls invocation
        ↓
Your code depends on its correctness
```

---

## 5. Callback Hell vs. Inversion of Control

These concepts describe different problems:

| Callback Hell | Inversion of Control |
|---|---|
| Too many nested callbacks make code difficult to read and maintain. | Another function controls when and how your callback is invoked. |
| Mainly a code-structure problem. | Mainly a control and reliability problem. |
| Produces deeply nested logic. | Can cause a callback to be missed, called too early, or called multiple times. |

Both problems can occur in the same callback-based application.

---

## 6. Callback Contracts

When an API accepts a callback, it should define a reliable contract. A well-behaved asynchronous operation should make clear:

```text
When is the callback invoked?
How many times is it invoked?
What arguments does it receive?
What happens if the operation fails?
```

For example, the intended contract for `createOrder()` might be:

```text
1. Start creating the order.
2. Invoke the callback exactly once after success.
3. Do not invoke it before completion.
4. Report failure through a defined error mechanism.
```

Callback-based code becomes difficult to trust when these rules are unclear or not followed.

---

## 7. Interview Questions

### What is a callback?

A function passed to another function so that the receiving function can invoke it later or when an operation is ready.

### Why are callbacks useful for dependent operations?

They allow the next operation to start only after the previous asynchronous operation completes.

### What is Callback Hell?

Callback Hell is deeply nested callback code created by many dependent asynchronous operations. It is also called the Pyramid of Doom.

### Why is Callback Hell difficult to maintain?

Deep nesting makes the order of execution, error handling, and later changes harder to understand.

### What is Inversion of Control?

It is the situation where we give control over callback invocation to another function and depend on that function to invoke the callback correctly.

### What can go wrong with Inversion of Control?

The receiving function might never call the callback, call it more than once, or call it at the wrong time.

### Are Callback Hell and Inversion of Control the same?

No. Callback Hell concerns code structure and nesting. Inversion of Control concerns dependence on another function's callback behavior.

---

## 8. Final Mental Model

### Callback sequencing

```text
Operation A starts
      ↓
A completes
      ↓
Callback runs
      ↓
Operation B starts
```

### Callback Hell

```text
A(callback)
  └── B(callback)
        └── C(callback)
              └── D()
```

### Inversion of Control

```text
Your code gives another function a callback
              ↓
That function decides when to invoke it
              ↓
Your code depends on its callback contract
```

### Key takeaways

```text
1. A callback is a function passed for later invocation.
2. Callbacks can sequence dependent asynchronous operations.
3. Callback Hell is excessive nesting of dependent callbacks.
4. The Pyramid of Doom is another name for Callback Hell.
5. Inversion of Control means another function controls callback invocation.
6. A callback may be missed, called twice, or called at the wrong time if the contract is unreliable.
7. Callback Hell and Inversion of Control are separate problems that can occur together.
```

> **Core rule:** Callbacks can coordinate dependent asynchronous work, but deep nesting creates Callback Hell, while handing callback control to another function introduces Inversion of Control and a dependency on that function's correctness.
