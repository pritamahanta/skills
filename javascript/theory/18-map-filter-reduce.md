# `map()`, `filter()`, and `reduce()` in JavaScript

`map()`, `filter()`, and `reduce()` are higher-order array methods. Each accepts a callback and helps process arrays without repeating manual loop logic.

```text
map    → transform every element
filter → select some elements
reduce → accumulate one result
```

---

## 1. `map()`: Transform Every Element

`map()` calls a callback for every element and returns a new array containing the callback's return values.

```javascript
const output = array.map(callback);
```

### Double each element

```javascript
const arr = [5, 1, 3, 2, 6];

function double(x) {
  return x * 2;
}

const output = arr.map(double);

console.log(output); // [10, 2, 6, 4, 12]
```

### Convert numbers to binary

```javascript
const binaryArr = arr.map((x) => x.toString(2));

console.log(binaryArr); // ["101", "1", "11", "10", "110"]
```

Use `map()` when every input element should produce a corresponding output element.

```text
Input array  → [a, b, c]
Callback     → transform each value
Output array → [f(a), f(b), f(c)]
```

`map()` returns a new array and does not modify the original array itself.

---

## 2. `filter()`: Select Matching Elements

`filter()` returns a new array containing only the elements for which the callback returns a truthy value.

```javascript
const output = array.filter(callback);
```

### Filter odd numbers

```javascript
const arr = [5, 1, 3, 2, 6];

function isOdd(x) {
  return x % 2 !== 0;
}

const oddArr = arr.filter(isOdd);

console.log(oddArr); // [5, 1, 3]
```

The same operation can use an arrow function:

```javascript
const oddArr = arr.filter((x) => x % 2 !== 0);
```

Use `filter()` when the goal is selection rather than transformation.

```text
Element → callback returns truthy → included
Element → callback returns falsy  → excluded
```

`filter()` returns a new array and does not modify the original array itself.

---

## 3. `reduce()`: Accumulate a Result

`reduce()` processes the array and combines its elements into one accumulated result. The result can be a number, object, array, string, or another value.

```javascript
const result = array.reduce(callback, initialValue);
```

The callback commonly receives:

- `accumulator`: the result built so far
- `currentValue`: the element currently being processed

Providing `initialValue` explicitly makes the starting state clear and determines the accumulator's initial type.

### Calculate a sum

```javascript
const arr = [5, 1, 3, 2, 6];

const sum = arr.reduce((acc, current) => {
  return acc + current;
}, 0);

console.log(sum); // 17
```

The accumulator changes as follows:

| Current value | Accumulator before | Accumulator after |
|---:|---:|---:|
| 5 | 0 | 5 |
| 1 | 5 | 6 |
| 3 | 6 | 9 |
| 2 | 9 | 11 |
| 6 | 11 | 17 |

### Find the maximum value

```javascript
const max = arr.reduce((acc, current) => {
  if (current > acc) {
    acc = current;
  }

  return acc;
}, -Infinity);

console.log(max); // 6
```

`-Infinity` is a safe starting point even when all input values are negative.

### Count users by age

```javascript
const users = [
  { firstName: "Alok", lastName: "Raj", age: 23 },
  { firstName: "Ashish", lastName: "Kumar", age: 29 },
  { firstName: "Ankit", lastName: "Roy", age: 29 },
  { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];

const report = users.reduce((acc, user) => {
  if (acc[user.age]) {
    acc[user.age]++;
  } else {
    acc[user.age] = 1;
  }

  return acc;
}, {});

console.log(report); // { 23: 1, 29: 2, 50: 1 }
```

The accumulator starts as `{}`. For each user, the matching age count is incremented or initialized to `1`.

This demonstrates that `reduce()` can transform an array into a single summary object, not just a number.

---

## 4. Transforming Arrays of Objects With `map()`

`map()` is useful for extracting or reshaping information from objects.

```javascript
const fullNames = users.map(
  (user) => user.firstName + " " + user.lastName
);

console.log(fullNames);
// ["Alok Raj", "Ashish Kumar", "Ankit Roy", "Pranav Mukherjee"]
```

Each user object becomes one full-name string in the new array.

---

## 5. Chaining Array Methods

Array methods can be chained when one operation's output becomes the next operation's input.

Suppose we want the first names of users younger than `30`:

```javascript
const output = users
  .filter((user) => user.age < 30)
  .map((user) => user.firstName);

console.log(output); // ["Alok", "Ashish", "Ankit"]
```

The process is:

1. `filter()` keeps users whose age is less than `30`.
2. `map()` transforms those users into first names.

This separates selection from transformation and makes the data flow easy to read.

### Combining both steps with `reduce()`

```javascript
const output = users.reduce((acc, user) => {
  if (user.age < 30) {
    acc.push(user.firstName);
  }

  return acc;
}, []);

console.log(output); // ["Alok", "Ashish", "Ankit"]
```

Here, the accumulator starts as an empty array and receives the first name of each matching user.

Both approaches produce the same result. Chaining can make separate operations clearer, while `reduce()` is useful when the entire accumulation naturally belongs in one pass.

---

## 6. Comparison

| Method | Main purpose | Return value |
|---|---|---|
| `map()` | Transform every element | New array with one result per input element |
| `filter()` | Select elements matching a condition | New array containing selected elements |
| `reduce()` | Accumulate elements into a result | One accumulated result of any suitable type |

All three methods accept callbacks and are therefore higher-order functions.

---

## 7. Choosing the Right Method

Ask what the output should represent:

```text
Need one transformed value for each element?
→ map()

Need only the elements that pass a condition?
→ filter()

Need one combined result such as a sum, object, or array?
→ reduce()
```

Avoid using `map()` when its returned array is not needed, and avoid using `reduce()` when a simple `map()` or `filter()` expresses the intent more clearly.

---

## 8. Interview Questions

### What does `map()` do?

It applies a callback to every array element and returns a new array containing the callback results.

### What does `filter()` do?

It returns a new array containing only the elements whose callback result is truthy.

### What does `reduce()` do?

It processes array elements into one accumulated result, using an accumulator and an optional initial value.

### Do these methods modify the original array?

The methods themselves do not modify the original array. However, a callback could mutate an object referenced by an element, so object mutation is a separate concern.

### Why provide an initial value to `reduce()`?

It makes the starting state and accumulator type explicit and avoids special behavior for the first element, especially when reducing an empty array.

### Can `reduce()` return an array or object?

Yes. The accumulator can be any appropriate type, including a number, array, object, or string.

### Can these methods be chained?

Yes. For example, `filter()` can select elements and `map()` can transform the selected results.

### Are `map()`, `filter()`, and `reduce()` higher-order functions?

Yes. Each accepts a callback function.

---

## 9. Final Mental Model

```text
Input array
     │
     ├── map(callback)
     │      └── transform every element → new array
     │
     ├── filter(callback)
     │      └── keep matching elements → new array
     │
     └── reduce(callback, initialValue)
            └── combine elements → one result
```

### Key takeaways

```text
1. map() transforms every element and returns a new array.
2. filter() selects elements whose callback result is truthy.
3. reduce() combines elements into one accumulated result.
4. All three methods accept callbacks and are higher-order functions.
5. The original array is not modified by these methods themselves.
6. map() is for transformation, filter() is for selection, and reduce() is for accumulation.
7. Chaining separates multiple array-processing steps into readable operations.
```

> **Core rule:** Use `map()` to transform, `filter()` to select, and `reduce()` to accumulate.
