# Block Scope & Shadowing in JavaScript

## 1. What Is a Block?

A **block** is a group of JavaScript statements enclosed in curly braces `{}`. It is also called a **compound statement**.

```javascript
{
  var a = 10;
  let b = 20;
  const c = 30;
}
```

Blocks allow multiple statements to be used where JavaScript expects a single statement.

```javascript
if (true) {
  console.log("Hello");
  console.log("World");
}
```

Without the braces, the `if` statement would control only the first statement.

```text
Block
→ groups statements
→ can create block scope for let and const
```

---

## 2. Block Scope

Block scope is the region in which a block-scoped binding can be accessed.

```javascript
{
  let b = 20;
  const c = 30;

  console.log(b); // 20
  console.log(c); // 30
}
```

Outside the block, these bindings are unavailable:

```javascript
{
  let b = 20;
  const c = 30;
}

console.log(b); // ReferenceError
console.log(c); // ReferenceError
```

Conceptually:

```text
Outer Scope
    │
    └── Block Scope
         ├── b
         └── c
```

`let` and `const` belong to the block where they are declared.

---

## 3. `var` Is Not Block-Scoped

A block does not create a separate scope for `var`:

```javascript
{
  var a = 10;
}

console.log(a); // 10
```

However, a function does create a separate `var` scope:

```javascript
function test() {
  var a = 10;
}

console.log(a); // ReferenceError
```

The basic distinction is:

```text
var        → function-scoped
let/const  → block-scoped
```

---

## 4. Comparing All Three Declarations

```javascript
var a = 10;

{
  var x = 20;
  let y = 30;
  const z = 40;
}

console.log(x); // 20
console.log(y); // ReferenceError
console.log(z); // ReferenceError
```

Why?

```text
x → var → not restricted by the block
y → let → belongs to the block
z → const → belongs to the block
```

Conceptually, the bindings are stored in different environments:

```text
Outer Scope
└── a

Block Scope
├── y
└── z

Function/global var scope
└── x
```

---

## 5. Block vs Scope

Do not treat these terms as identical.

### Block

A syntactic structure containing statements:

```javascript
{
  // statements
}
```

### Scope

The region where a variable or function can be accessed.

```text
Block
→ syntax and statement grouping

Scope
→ accessibility of bindings
```

A block creates a new scope for `let` and `const`, but not for `var`.

---

## 6. What Is Shadowing?

**Shadowing** occurs when an inner scope declares a binding with the same name as a binding in an outer scope.

```javascript
let b = 100;

{
  let b = 20;
  console.log(b); // 20
}

console.log(b); // 100
```

There are two separate bindings:

```text
Outer Scope
b → 100

Block Scope
b → 20
```

Inside the block, the inner `b` shadows the outer `b`. Outside the block, the outer binding is visible again.

---

## 7. How Shadowing Works

When JavaScript evaluates a variable inside a scope, it searches the current scope first.

```javascript
let a = 100;

{
  let a = 20;
  console.log(a);
}
```

Lookup proceeds as follows:

```text
Current Block Scope
        ↓
a found → use 20
```

Because a matching binding is found immediately, JavaScript does not continue searching the outer scope.

If the inner binding does not exist, lookup moves outward:

```text
Inner Scope
    ↓
Outer Scope
    ↓
Global / Script Scope
```

---

## 8. Shadowing With `const`

`const` follows the same shadowing rules as `let`:

```javascript
const c = 100;

{
  const c = 30;
  console.log(c); // 30
}

console.log(c); // 100
```

The inner `c` is a different binding and does not modify the outer one.

---

## 9. Why `var` Behaves Differently

Consider:

```javascript
var a = 100;

{
  var a = 20;
}

console.log(a); // 20
```

This does not create two block-specific `var` bindings. Both declarations refer to the same function- or global-scoped binding because the block does not create a `var` scope.

```text
Global/function scope
  a → 100
  a = 20
  a → 20
```

This differs from nested `let` or `const` declarations, which create separate bindings when their scopes differ.

---

## 10. Shadowing in Functions

Shadowing also occurs across function boundaries:

```javascript
var a = 100;

function test() {
  var a = 20;
  console.log(a); // 20
}

test();
console.log(a); // 100
```

Conceptually:

```text
Global Scope
a → 100

Function Scope
 a → 20
```

The function's `a` shadows the global `a` while the function is executing.

Nested functions can create several levels of shadowing:

```javascript
let a = 100;

function outer() {
  let a = 20;

  function inner() {
    let a = 30;
    console.log(a); // 30
  }

  inner();
}

outer();
```

Lookup starts in `inner`, so the closest binding, `30`, is used.

---

## 11. Nested Block Shadowing

```javascript
let a = 100;

{
  let a = 20;

  {
    let a = 30;
    console.log(a); // 30
  }
}
```

The lexical environments are:

```text
Global / Script
a → 100
│
└── Block 1
    a → 20
    │
    └── Block 2
        a → 30
```

The lookup chain of Block 2 is:

```text
Block 2
   ↓
Block 1
   ↓
Global / Script
```

If a binding is not found in the current block, JavaScript continues outward until it finds one or reaches the end of the scope chain.

Example:

```javascript
let a = 100;

{
  let b = 20;

  {
    console.log(a); // 100
  }
}
```

The nested block does not have `a`, so lookup eventually finds it in the outer script scope.

---

## 12. Illegal Shadowing

Some combinations of `var`, `let`, and `const` create an invalid declaration conflict.

```javascript
let a = 20;

{
  var a = 30;
}
```

This results in a `SyntaxError` because `var` is function/global-scoped and conflicts with the existing lexical `let` binding in the overlapping scope.

Conceptually:

```text
let a
  ↓
lexical binding

var a
  ↓
function/global binding in the same overlapping scope
  ↓
conflict
  ↓
SyntaxError
```

The function boundary changes the situation:

```javascript
let a = 20;

function test() {
  var a = 30;
  console.log(a); // 30
}

test();
```

This is valid because the `var` binding belongs to `test`'s function scope and does not cross into the outer lexical scope.

---

## 13. Valid Nested Shadowing

Different lexical scopes may contain bindings with the same name.

### `let` shadowing `let`

```javascript
let a = 20;

{
  let a = 30;
  console.log(a); // 30
}

console.log(a); // 20
```

### `const` shadowing `const`

```javascript
const a = 20;

{
  const a = 30;
  console.log(a); // 30
}

console.log(a); // 20
```

Same name does not necessarily mean same variable. The scope in which each binding is declared determines whether they are separate.

---

## 14. Arrow Functions and Lexical Scope

For scope and shadowing, arrow functions follow the same general lexical-scoping principles as normal functions.

```javascript
let a = 100;

const test = () => {
  let a = 20;
  console.log(a); // 20
};

test();
console.log(a); // 100
```

The `a` inside the arrow function is a separate binding that shadows the outer `a` while the function runs.

---

## 15. Scope Comparison

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Function-scoped | Yes | No | No |
| Block-scoped | No | Yes | Yes |
| Same-scope redeclaration | Allowed | Not allowed | Not allowed |
| Reassignment | Allowed | Allowed | Not allowed |
| Separate binding in nested block | No | Yes | Yes |
| Participates in lexical lookup | Yes | Yes | Yes |

---

## 16. Common Mistakes

### Mistake 1: “A block is always a scope.”

A block is a syntactic group of statements. It creates block scope for `let` and `const`, but not for `var`.

### Mistake 2: “Same names always mean different variables.”

Not with `var` in the same function or global scope:

```javascript
var a = 10;

{
  var a = 20;
}
```

Both declarations refer to the same binding in this example.

### Mistake 3: “Shadowing changes the outer variable.”

An inner `let` or `const` creates a separate binding:

```javascript
let a = 100;

{
  let a = 20;
}

console.log(a); // 100
```

### Mistake 4: “`var` can always shadow `let`.”

No. This is invalid:

```javascript
let a = 10;

{
  var a = 20;
}
```

A function boundary can make it valid because the `var` then belongs to a separate function scope.

### Mistake 5: “The caller determines scope.”

Scope is lexical. It depends on where the code is written, not simply on which function calls it.

---

## 17. Interview Questions

### What is a block?

A block is a group of statements enclosed in `{}`. It is also called a compound statement and lets multiple statements be used where JavaScript expects one statement.

### What is block scope?

Block scope is the scope associated with a block for declarations such as `let` and `const`.

### Is `var` block-scoped?

No. `var` is function-scoped.

### What is shadowing?

Shadowing occurs when an inner scope declares a binding with the same name as a binding in an outer scope.

### Why does inner `let` not modify outer `let`?

They are separate bindings belonging to different lexical scopes.

### What is illegal shadowing?

Illegal shadowing is an invalid conflict caused when a `var` declaration crosses an overlapping scope boundary and conflicts with an existing lexical `let` or `const` binding.

```javascript
let a = 10;

{
  var a = 20; // SyntaxError
}
```

### Why can `var` inside a function shadow an outer `let`?

Because `var` is scoped to the function. It does not create a conflicting declaration in the outer lexical scope.

### Do arrow functions use different scope rules?

For lexical scope and shadowing, no. Arrow functions and normal functions follow the same general lexical-scope principles.

---

## 18. Final Mental Model

### Scope types

```text
                    SCOPE
                      │
            ┌─────────┴─────────┐
            │                   │
        Function Scope       Block Scope
            │                   │
           var              let / const
```

### Nested lookup

```text
Inner Block
     ↓
Outer Block
     ↓
Function / Script
     ↓
Global
```

### Variable lookup

```text
Search current scope
        ↓
Found?
├── Yes → use it
└── No
     ↓
Search outer scope
     ↓
Continue outward
     ↓
Variable found or ReferenceError
```

### Shadowing

```text
Outer:
a → 100

Inner:
a → 20
```

Inside the inner scope, `a` resolves to `20`. Outside it, `a` resolves to `100`.

---

## 19. Key Takeaways

```text
1. A block is a group of statements enclosed in {}.
2. A block can create block scope for let and const.
3. var is function-scoped, not block-scoped.
4. Shadowing occurs when an inner scope declares the same name as an outer scope.
5. Nested let and const declarations create separate bindings.
6. A block does not create a separate var binding.
7. Illegal shadowing can occur when var conflicts with a lexical let/const binding across overlapping scope boundaries.
8. Scope is lexical and depends on where code is written.
9. Lookup starts in the current scope and moves outward.
10. Arrow functions follow the same general lexical-scope principles as normal functions.
```

> **Core rule:** Block scope determines which `let` and `const` bindings are accessible inside a block. Shadowing occurs when an inner scope introduces a binding with the same name as an outer binding. `var` follows function scope, so an ordinary block does not create a separate `var` binding.
