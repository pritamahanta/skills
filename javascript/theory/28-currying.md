# JavaScript: Currying

## 1. What is currying?

**Currying** transforms a function that takes multiple arguments into a sequence of functions, where arguments are supplied incrementally.

A normal function:

```js
function sum(a, b, c) {
  return a + b + c;
}

console.log(sum(2, 3, 4));
// 9
```

A curried version:

```js
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(sum(2)(3)(4));
// 9
```

The calls work as follows:

1. `sum(2)` returns another function.
2. That function receives `3` and returns another function.
3. The final function receives `4` and calculates the result.

Each inner function remembers the arguments received by earlier functions.

---

## 2. Why currying works: closures

A closure allows an inner function to access variables from its outer function even after the outer function has finished executing.

```js
function outer(a) {
  return function inner(b) {
    return a + b;
  };
}

const addFive = outer(5);

console.log(addFive(10));
// 15
```

When `outer(5)` runs, it returns `inner` while preserving access to `a`, whose value is `5`. Later, `addFive(10)` uses the preserved value and calculates `5 + 10`.

Currying uses the same closure behavior to remember arguments from previous calls.

---

## 3. Manual currying

### Addition

```js
function add(a) {
  return function (b) {
    return a + b;
  };
}

const addFive = add(5);

console.log(addFive(10));  // 15
console.log(addFive(20));  // 25
```

`add(5)` creates a reusable function that remembers `a = 5`.

### Multiplication with three arguments

```js
function multiply(a) {
  return function (b) {
    return function (c) {
      return a * b * c;
    };
  };
}

console.log(multiply(2)(3)(4));
// 24
```

### Arrow-function syntax

```js
const multiply = (a) => (b) => (c) => a * b * c;

console.log(multiply(2)(3)(4));
// 24
```

This is a shorter way to write nested functions.

---

## 4. A generic `curry()` function

Instead of manually converting each function, we can create a reusable utility:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return function (...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}
```

### How it works

- `fn` is the original function to transform.
- `curried(...args)` collects the arguments received so far.
- `fn.length` gives the number of formal parameters used by the original function, subject to JavaScript's parameter-counting rules.
- Once enough arguments have been collected, `fn(...args)` executes the original function.
- Otherwise, another function is returned to collect more arguments.

For example:

```js
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(2)(3)(4));
console.log(curriedSum(2, 3)(4));
console.log(curriedSum(2)(3, 4));
```

Output:

```text
9
9
9
```

This implementation supports supplying arguments one at a time or grouping them across calls.

### `fn.length` limitation

`fn.length` does not count parameters after the first parameter with a default value, and it does not count rest parameters:

```js
function greet(name, message = "Hello") {
  return `${message}, ${name}`;
}

console.log(greet.length);
// 1
```

Therefore, relying only on `fn.length` may not provide the intended arity for functions with default or rest parameters. In such cases, a curry utility can accept the expected arity explicitly.

---

## 5. Practical uses of currying

### Reusable discount functions

```js
function applyDiscount(discount) {
  return function (price) {
    return price - (price * discount / 100);
  };
}

const discount10 = applyDiscount(10);
const discount20 = applyDiscount(20);

console.log(discount10(1000));  // 900
console.log(discount20(1000));  // 800
```

The returned functions remember their discount percentages.

### Configurable message functions

```js
const createMessage = (prefix) => (message) => {
  return `${prefix}: ${message}`;
};

const errorMessage = createMessage("ERROR");
const successMessage = createMessage("SUCCESS");

console.log(errorMessage("Something went wrong"));
console.log(successMessage("Data saved successfully"));
```

Output:

```text
ERROR: Something went wrong
SUCCESS: Data saved successfully
```

Each returned function remembers its own prefix.

### Reusable API configuration

```js
const createApiUrl = (baseUrl) => (endpoint) => {
  return `${baseUrl}/${endpoint}`;
};

const productionApi = createApiUrl("https://api.example.com");
const stagingApi = createApiUrl("https://staging.example.com");

console.log(productionApi("users"));
console.log(stagingApi("users"));
```

Output:

```text
https://api.example.com/users
https://staging.example.com/users
```

The base URL is supplied once, and the returned functions can be reused with different endpoints.

---

## 6. Currying vs. partial application

These concepts are related but different.

### Currying

Currying transforms a multi-argument function into nested functions that accept arguments incrementally:

```js
function multiply(a) {
  return function (b) {
    return function (c) {
      return a * b * c;
    };
  };
}

multiply(2)(3)(4);
```

### Partial application

Partial application fixes some arguments and returns a function for the remaining arguments:

```js
function multiply(a, b, c) {
  return a * b * c;
}

const multiplyByTwo = (b, c) => multiply(2, b, c);

console.log(multiplyByTwo(3, 4));
// 24
```

| Feature | Currying | Partial application |
|---|---|---|
| Meaning | Converts a multi-argument function into nested functions. | Fixes some arguments and returns a function for the rest. |
| Argument handling | Usually one argument per function call. | Can fix one or multiple arguments. |
| Function structure | Produces a sequence of functions. | Does not require nested functions. |
| Example | `sum(2)(3)(4)` | `multiplyByTwo(3, 4)` |

---

## 7. Important points and common mistakes

### Currying is not three independent calls

```js
sum(2)(3)(4);
```

The first calls return functions. The final call executes the calculation.

### JavaScript does not automatically curry functions

A normal function is not automatically transformed into a curried function. The nested functions must be written manually or created with a curry utility.

### Generic currying depends on function arity

The generic implementation uses `fn.length`, which has limitations with default and rest parameters. For those functions, the expected arity may need to be supplied separately.

---

## Interview practice

### Question 1: What is the output?

```js
function add(a) {
  return function (b) {
    return a + b;
  };
}

console.log(add(10)(20));
```

Output:

```text
30
```

### Question 2: What is the output?

```js
const multiply = (a) => (b) => (c) => a * b * c;

console.log(multiply(2)(5)(3));
```

Output:

```text
30
```

### Question 3: What is the output?

```js
function calculate(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

const result = calculate(1)(2);

console.log(result(3));
```

Output:

```text
6
```

`calculate(1)(2)` returns a function that still needs the third argument.

### Question 4: Implement a curried subtraction function

Expected usage:

```js
subtract(20)(5);
// 15
```

One solution:

```js
function subtract(a) {
  return function (b) {
    return a - b;
  };
}
```

### Question 5: Implement a generic curry function

Given:

```js
function volume(length, width, height) {
  return length * width * height;
}
```

Expected usage:

```js
const curriedVolume = curry(volume);

console.log(curriedVolume(2)(3)(4));
// 24
```

Use the generic `curry()` implementation from this note.

---

## Final reference

A normal function:

```js
function original(a, b, c) {
  return a + b + c;
}
```

Can be written in curried form:

```js
function curried(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
```

Usage:

```js
curried(1)(2)(3);
```

## References

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info: Currying and partial application](https://javascript.info/currying-partials)
