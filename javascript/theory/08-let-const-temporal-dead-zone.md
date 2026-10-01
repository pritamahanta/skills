# let, const & Temporal Dead Zone

## 1. `var`, `let` and `const`

JavaScript gives three common ways to declare variables:

```javascript
var a = 10;
let b = 20;
const c = 30;
```

Their behavior differs in important ways:

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisted | Yes | Yes | Yes |
| Initial state | `undefined` | Uninitialized | Uninitialized |
| TDZ | No | Yes | Yes |
| Same-scope redeclaration | Allowed | Not allowed | Not allowed |
| Reassignment | Allowed | Allowed | Not allowed |
| Initializer required | No | No | Yes |

The key difference is not whether they are hoisted, but how they are initialized and when they become accessible.

---

## 2. `var` before initialization

```javascript
console.log(a);

var a = 10;
```

Output:

```text
undefined
```

During memory creation, `var a` is assigned to the global storage and initialized to `undefined`.

```text
Global storage
  ↓
a → undefined
```

So `console.log(a)` can run before the assignment line executes.

---

## 3. `let` and `const` are also hoisted

Consider:

```javascript
console.log(a);

let a = 10;
```

This throws:

```text
ReferenceError: Cannot access 'a' before initialization
```

The important idea is:

- the binding is created during hoisting/setup
- it is stored in a separate script memory space
- it is not initialized yet
- it is not accessible until execution reaches the declaration

Conceptually:

```text
Script memory
  ↓
a → uninitialized
```

This is why `let`/`const` are not usable before initialization.

---

## 4. Why `var` behaves differently

For `var`:

```javascript
var a = 10;
```

the binding is created in global storage and initialized to `undefined`.

For `let`/`const`:

```javascript
let a = 10;
const b = 20;
```

the binding is created in script memory, but it remains uninitialized until the declaration runs.

So:

```text
var → accessible as undefined before assignment
let/const → inaccessible before initialization
```

---

## 5. Temporal Dead Zone (TDZ)

The Temporal Dead Zone is the period between:

1. the creation of a `let`/`const` binding, and
2. the moment that binding is initialized.

Example:

```javascript
console.log(a);

let a = 10;
```

Conceptually:

```text
Binding created
      ↓
      TDZ
      ↓
let a = 10 executes
      ↓
a → 10
      ↓
TDZ ends
```

So the rule is:

> A `let` or `const` variable cannot be accessed before it has been initialized.

---

## 6. TDZ applies to `const` too

```javascript
console.log(a);

const a = 10;
```

Result:

```text
ReferenceError: Cannot access 'a' before initialization
```

`const` follows the same rule as `let`.

---

## 7. `undefined` vs TDZ

This is a common confusion.

### `var`

```javascript
console.log(a);
var a = 10;
```

This logs:

```text
undefined
```

### `let`

```javascript
console.log(a);
let a = 10;
```

This throws a `ReferenceError`.

The difference is:

```text
var   → binding exists, initialized to undefined
let   → binding exists, but in TDZ before initialization
const → binding exists, but in TDZ before initialization
```

So `let`/`const` are not “undefined as a usable value”; they are uninitialized and inaccessible during the TDZ.

---

## 8. `window` and global storage

In a browser's classic script environment:

```javascript
var a = 10;
let b = 20;
const c = 30;
```

Conceptually:

```text
Global Object (`window`)
  └── a → 10

Script memory
  ├── b → 20
  └── c → 30
```

Therefore:

```javascript
console.log(window.a); // 10
console.log(window.b); // undefined
console.log(window.c); // undefined
```

The reason is not that `let`/`const` are not hoisted. They are hoisted, but they live in a different memory space and are not properties of `window`.

---

## 9. `let` and `const` are still hoisted

This statement is the correct mental model:

> `let` and `const` are hoisted, but they remain inaccessible until initialization.

Example:

```javascript
console.log(a);

let a = 10;
```

The binding is created during setup, but it is still in the TDZ when the code tries to access it.

So the error is not because hoisting did not happen; it is because the binding is not ready yet.

---

## 10. When does the TDZ end?

```javascript
let a = 10;

console.log(a);
```

Once execution reaches the declaration, JavaScript initializes the binding.

```text
Binding created
      ↓
TDZ
      ↓
Initialization happens
      ↓
Normal access allowed
```

Then:

```text
10
```

---

## 11. `let` can be declared before assignment

```javascript
let a;

a = 10;

console.log(a);
```

Output:

```text
10
```

So declaration and assignment can happen at different times for `let`.

---

## 12. `const` must be initialized immediately

This is invalid:

```javascript
const a;
```

It throws:

```text
SyntaxError: Missing initializer in const declaration
```

`const` requires initialization at declaration time:

```javascript
const a = 10;
```

---

## 13. `const` cannot be reassigned

```javascript
const a = 10;

a = 20;
```

This throws:

```text
TypeError: Assignment to constant variable
```

So:

```text
const
→ must be initialized
→ cannot be reassigned
```

---

## 14. `let` can be reassigned

```javascript
let a = 10;

a = 20;

console.log(a);
```

Output:

```text
20
```

So:

```text
let → reassignment allowed
```

---

## 15. Redeclaration rules

### `var`

```javascript
var a = 10;
var a = 20;
```

This is valid.

### `let`

```javascript
let a = 10;
let a = 20;
```

This throws:

```text
SyntaxError
```

### `const`

```javascript
const a = 10;
const a = 20;
```

This also throws:

```text
SyntaxError
```

So the rule is:

```text
var → same-scope redeclaration allowed
let/const → same-scope redeclaration not allowed
```

---

## 16. `const` does not mean immutable object

`const` prevents reassignment of the variable binding, not modification of the object itself.

```javascript
const user = {
  name: "Pritam"
};

user.name = "Alex";
```

This is allowed.

But this is not allowed:

```javascript
user = {};
```

Because the variable binding cannot be reassigned.

---

## 17. Error types

### ReferenceError

The variable is declared but cannot be accessed yet, or it cannot be resolved.

```javascript
console.log(a);
let a = 10;
```

### SyntaxError

The code structure is invalid.

```javascript
let a = 10;
let a = 20;
```

### TypeError

The operation itself is invalid for the current value or binding.

```javascript
const a = 10;
a = 20;
```

---

## 18. A complete example

```javascript
console.log(a);
console.log(b);

let a = 10;
var b = 20;
```

Memory setup is conceptually:

```text
Global
  └── b → undefined

Script
  └── a → uninitialized
```

Execution begins:

```javascript
console.log(a);
```

`a` exists, but it is still in the TDZ, so JavaScript throws a `ReferenceError` before reaching further execution.

---

## 19. Final mental model

```text
var
→ global storage
→ initialized to undefined
→ accessible before assignment

let / const
→ script storage
→ binding created, but uninitialized
→ not accessible until initialization
→ TDZ before initialization
```

And the core rule:

> `let` and `const` are hoisted, but they remain in the Temporal Dead Zone until their declarations initialize them.

---

## 20. Interview-ready summary

```text
var
- function-scoped
- initialized to undefined
- no TDZ
- accessible before assignment
- global property in browser scripts

let
- block-scoped
- TDZ before initialization
- reassignment allowed
- same-scope redeclaration not allowed

const
- block-scoped
- TDZ before initialization
- initializer required
- reassignment not allowed
- same-scope redeclaration not allowed
```

### Most important rule

> `let` and `const` are hoisted, but unlike `var`, they are not usable before initialization. The phase before initialization is called the Temporal Dead Zone.
