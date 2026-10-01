# `undefined` vs. `not defined` in JavaScript

## 1. `undefined`

`undefined` is a **JavaScript value**. It commonly appears when a variable has been declared but has not yet been assigned another value.

```js
var a;

console.log(a);
```

Output:

```text
undefined
```

Conceptually:

```text
a → undefined
```

This connects directly to the Memory Creation Phase of JavaScript execution.

## 2. Why Does `undefined` Appear?

Consider:

```js
var a = 7;
```

Before the assignment executes, JavaScript has already created the variable's binding during execution-context creation. For a `var` declaration, the initial value is:

```text
a → undefined
```

When the assignment executes:

```js
a = 7;
```

the value changes:

```text
a → 7
```

### Flow

```text
Execution Context Creation
          ↓
Memory allocated for a
          ↓
a → undefined
          ↓
Code Execution
          ↓
a = 7
          ↓
a → 7
```

## 3. Example: Reading Before Assignment

```js
console.log(a);

var a = 7;
```

Output:

```text
undefined
```

At the beginning:

```text
a → undefined
```

`console.log(a)` runs before `a = 7`, so the current value is still `undefined`. After the assignment:

```text
a → 7
```

## 4. `undefined` vs. `not defined`

These are completely different situations.

### `undefined`

The variable exists, but its current value is `undefined`:

```js
var a;

console.log(a);
```

```text
undefined
```

### `not defined`

The identifier has not been declared, so JavaScript cannot find it:

```js
console.log(x);
```

if `x` was never declared.

Result:

```text
ReferenceError: x is not defined
```

### Core difference

```text
undefined
    ↓
Variable exists
    ↓
Value = undefined

not defined
    ↓
No available declaration or binding
    ↓
ReferenceError
```

## 5. Side-by-Side Example

```js
var a;

console.log(a);
console.log(x);
```

Assuming `x` was never declared:

```text
a → undefined

x → not found
```

Therefore:

```text
console.log(a)
→ undefined

console.log(x)
→ ReferenceError
```

## 6. `undefined` Is Not the Same as Empty

A common misconception is:

```text
undefined = empty
```

That is not correct. `undefined` is an actual JavaScript value.

For:

```js
var a;
```

the variable exists and currently has the value:

```text
undefined
```

You can think of it as a value that commonly represents the fact that no other value has been assigned yet.

## 7. A Variable Can Remain `undefined`

Consider:

```js
var a;

console.log(a);
console.log(a);
console.log(a);
```

Since `a` is never assigned another value:

```text
a → undefined
```

throughout the execution.

Output:

```text
undefined
undefined
undefined
```

## 8. Checking for `undefined`

You can explicitly check whether a variable currently contains `undefined`:

```js
var a;

if (a === undefined) {
  console.log("a is undefined");
} else {
  console.log("a is not undefined");
}
```

Output:

```text
a is undefined
```

The expression:

```js
a === undefined;
```

checks whether the current value of `a` is `undefined`.

After assigning a value:

```js
a = 10;
```

the condition becomes false:

```js
if (a === undefined) {
  console.log("a is undefined");
} else {
  console.log("a is not undefined");
}
```

Output:

```text
a is not undefined
```

## 9. JavaScript Variables Are Dynamically Typed

JavaScript does not permanently associate a variable with one specific data type.

For example:

```js
var a;

console.log(a);

a = 10;

console.log(a);

a = "hello world";

console.log(a);
```

Output:

```text
undefined
10
hello world
```

The same variable can hold values of different types over time:

```text
a
│
├── undefined
├── 10
└── "hello world"
```

This is valid too:

```js
var a = "hello";

a = 10;
a = true;
```

JavaScript is therefore commonly described as a **dynamically typed language**.

## 10. Loose Typing

JavaScript is also commonly described as **loosely typed**. The basic idea is that variables are not restricted to a single data type.

For example:

```js
var a = "hello";

a = 100;
a = false;
```

The variable `a` successively holds:

```text
string
  ↓
number
  ↓
boolean
```

JavaScript also performs type-related operations and conversions behind the scenes, leading to the broader topic of **type coercion**.

## 11. Type Coercion

**Type coercion** refers to conversion from one type to another during JavaScript operations.

JavaScript may convert values between types when performing an operation. The detailed rules are a separate topic; the important connection here is:

```text
JavaScript's flexible typing
        ↓
Values of different types are allowed
        ↓
Type conversion/coercion may occur
```

## 12. Do Not Assign `undefined` Unnecessarily

JavaScript allows:

```js
var a = undefined;
```

This is valid code, but it is generally not good practice to use `undefined` manually as your own placeholder.

Prefer:

```js
var a;
```

rather than:

```js
var a = undefined;
```

`undefined` already has a meaningful role in JavaScript: it commonly represents an uninitialized `var` variable or an absent value in certain situations. Using it deliberately as application-level data can make the meaning less clear.

## 13. Complete Example

```js
var a = 7;

console.log(a);

var b;

console.log(b);

console.log(c);
```

Assume `c` has never been declared.

Initially:

```text
a → undefined
b → undefined
```

After:

```js
a = 7;
```

we have:

```text
a → 7
b → undefined
```

Therefore:

```js
console.log(a);
```

prints:

```text
7
```

and:

```js
console.log(b);
```

prints:

```text
undefined
```

But:

```js
console.log(c);
```

produces:

```text
ReferenceError: c is not defined
```

## 14. Mental Model

When you see:

```js
console.log(a);

var a = 7;
```

think:

```text
Before execution:

a → undefined

console.log(a)
      ↓
undefined

a = 7
      ↓
a → 7
```

When you see:

```js
console.log(x);
```

and `x` was never declared:

```text
x
↓
No binding found
↓
ReferenceError
```

## 15. The Important Distinction

```text
┌─────────────────────────────┐
│         undefined           │
├─────────────────────────────┤
│ Variable exists             │
│ Current value is undefined  │
└─────────────────────────────┘

┌─────────────────────────────┐
│        not defined          │
├─────────────────────────────┤
│ Identifier cannot be found  │
│ ReferenceError              │
└─────────────────────────────┘
```

Remember:

> `undefined` is a value; “not defined” indicates that the identifier could not be found.

## 16. Connection With the Execution Context

The concepts fit together like this:

```text
JavaScript program
        ↓
Execution Context created
        ↓
Memory Creation Phase
        ↓
Memory allocated for variables
        ↓
var a → undefined
        ↓
Code Execution Phase
        ↓
a = 10
        ↓
a → 10
```

An undeclared variable is different:

```text
console.log(x)
       ↓
No declaration for x
       ↓
ReferenceError
```

## 17. Key Points to Remember

```text
1. undefined is a JavaScript value.

2. A declared var variable can initially have
   the value undefined.

3. During execution, the variable can later receive
   another value.

4. undefined does not mean the variable does not exist.

5. "x is not defined" means JavaScript could not find
   a declaration or binding for x.

6. JavaScript variables can hold values of different
   types at different times.

7. JavaScript is dynamically typed and commonly
   described as loosely typed.

8. Assigning undefined manually is valid but generally
   unnecessary and discouraged as a placeholder.
```

## 18. Interview Questions

### What is `undefined` in JavaScript?

`undefined` is a JavaScript value. For example, a declared `var` variable that has not yet been assigned another value can have the value `undefined`.

### What is the difference between `undefined` and `not defined`?

```text
undefined
→ Variable exists
→ Current value is undefined

not defined
→ Identifier cannot be found
→ ReferenceError
```

### Why does this return `undefined`?

```js
console.log(a);

var a = 10;
```

Because `a` has already been created during execution-context creation, but the assignment `a = 10` has not executed yet.

### Why does this throw an error?

```js
console.log(a);
```

when `a` has never been declared?

Because JavaScript cannot find a binding for `a`, so it throws a `ReferenceError`.

### Can a variable hold different data types in JavaScript?

Yes:

```js
var a = 10;
a = "hello";
a = true;
```

This is valid because JavaScript is dynamically typed.

### Should you manually assign `undefined`?

It is valid JavaScript, but it is generally better not to use `undefined` unnecessarily as a placeholder.

## Final Mental Model

```text
                 VARIABLE

        ┌──────────────────────┐
        │ Declared?            │
        └──────────┬───────────┘
                   │
             ┌─────┴─────┐
            YES          NO
             │            │
             ↓            ↓
      Variable exists    ReferenceError
             │
             ↓
    Has a value yet?
       │       │
      NO      YES
       │       │
       ↓       ↓
 undefined   Actual value
```

**Core rule:**

```text
undefined
= exists, but current value is undefined

not defined
= identifier does not exist in the accessible environment
```
