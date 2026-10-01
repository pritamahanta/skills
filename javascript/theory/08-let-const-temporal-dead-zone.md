# let, const & Temporal Dead Zone in JavaScript

## 1. `var`, `let` and `const`

JavaScript gives us three common variable declarations:

```javascript
var a = 10;
let b = 20;
const c = 30;
```

The key differences are:

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Binding created before execution | Yes | Yes | Yes |
| Initial state | `undefined` | Uninitialized | Uninitialized |
| Temporal Dead Zone | No | Yes | Yes |
| Redeclaration in same scope | Allowed | Not allowed | Not allowed |
| Reassignment | Allowed | Allowed | Not allowed |
| Declaration without initializer | Allowed | Allowed | Not allowed |

The most important difference is what happens before a declaration is initialized.

---

## 2. `var` Before Declaration

```javascript
console.log(a);

var a = 10;
```

Output:

```text
undefined
```

Conceptually:

```text
Memory Creation
      ↓
a → undefined

Code Execution
      ↓
console.log(a)
      ↓
undefined

a = 10
      ↓
a → 10
```

For `var`, the binding is created and initialized to `undefined` before execution reaches the assignment.

---

## 3. `let` Before Declaration

```javascript
console.log(a);

let a = 10;
```

This produces:

```text
ReferenceError
```

Conceptually:

```text
Memory Creation
      ↓
a → <uninitialized>

Code Execution
      ↓
console.log(a)
      ↓
ReferenceError
```

The `let` binding exists, but it is not initialized yet.

---

## 4. `const` Before Declaration

```javascript
console.log(a);

const a = 10;
```

Result:

```text
ReferenceError
```

Like `let`, `const` is created during setup but stays uninitialized until its declaration is evaluated.

---

## 5. Temporal Dead Zone (TDZ)

The Temporal Dead Zone is the period between:

1. creation of a `let` or `const` binding, and
2. initialization of that binding.

Example:

```javascript
console.log(a); // ReferenceError

let a = 10;
```

Conceptually:

```text
Binding created
      ↓
      TDZ
      ↓
Accessing a → ReferenceError
      ↓
let a = 10 executes
      ↓
a → 10
      ↓
TDZ ends
```

### Key rule

> A `let` or `const` variable cannot be accessed before it has been initialized.

---

## 6. Why It Is Called “Temporal”

Temporal means time-based.

The variable is not permanently inaccessible. It is inaccessible only during a specific phase of execution:

```text
Before initialization
       ↓
      TDZ
       ↓
  Initialization
       ↓
   Normal access
```

So TDZ is about when the variable is accessed, not just where it is declared.

---

## 7. Are `let` and `const` Hoisted?

Saying that `let` and `const` are “not hoisted” is incomplete.

A better mental model is:

```text
var
→ binding created
→ initialized to undefined

let / const
→ binding created
→ not initialized
→ TDZ
→ initialized when execution reaches declaration
```

So their bindings exist before execution reaches the declaration, but they cannot be used until initialization happens.

---

## 8. `var` vs `let` vs `const` During Creation

```javascript
var a = 10;
let b = 20;
const c = 30;
```

Conceptually:

```text
var:
a → undefined

let:
b → <uninitialized>

const:
c → <uninitialized>
```

After their declarations execute:

```text
a → 10
b → 20
c → 30
```

This is the core difference behind the different behavior.

---

## 9. `let` Is Block-Scoped

A block is typically `{ }`.

```javascript
{
  let a = 10;
  console.log(a);
}
```

Inside the block:

```text
a → 10
```

Outside it:

```javascript
{
  let a = 10;
}

console.log(a);
```

Result:

```text
ReferenceError
```

The binding belongs to that block.

---

## 10. `const` Is Also Block-Scoped

```javascript
{
  const a = 10;
  console.log(a);
}
```

But:

```javascript
{
  const a = 10;
}

console.log(a);
```

results in:

```text
ReferenceError
```

So:

```text
let   → block-scoped
const → block-scoped
```

---

## 11. `var` Is Function-Scoped

`var` does not create a block-scoped binding.

```javascript
{
  var a = 10;
}

console.log(a);
```

Output:

```text
10
```

A function creates a separate `var` scope:

```javascript
function test() {
  var a = 10;
}

console.log(a);
```

Result:

```text
ReferenceError
```

Therefore:

```text
var
→ function-scoped

let / const
→ block-scoped
```

---

## 12. Redeclaration

### `var`

Redeclaration in the same scope is allowed:

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

Result:

```text
SyntaxError
```

### `const`

```javascript
const a = 10;
const a = 20;
```

Result:

```text
SyntaxError
```

### Rule

```text
var
→ same-scope redeclaration allowed

let / const
→ same-scope redeclaration not allowed
```

---

## 13. Redeclaration vs Reassignment

These are different operations.

### Redeclaration

Declaring the same variable again:

```javascript
let a = 10;
let a = 20;
```

Not allowed in the same scope.

### Reassignment

Changing the existing variable's value:

```javascript
let a = 10;
a = 20;
```

Allowed.

So:

```text
let
├── redeclaration → not allowed
└── reassignment  → allowed
```

---

## 14. `const` Must Be Initialized

This is invalid:

```javascript
const a;
```

Result:

```text
SyntaxError
```

A `const` declaration must include an initializer:

```javascript
const a = 10;
```

Once initialized, the binding cannot be reassigned:

```javascript
const a = 10;

a = 20;
```

Result:

```text
TypeError
```

So:

```text
const
├── initializer required
├── reassignment not allowed
└── same-scope redeclaration not allowed
```

---

## 15. `let` Can Be Declared Without an Initial Value

Unlike `const`, `let` can be declared first and assigned later:

```javascript
let a;

a = 10;
```

This is valid.

Conceptually:

```text
let a
  ↓
binding exists
  ↓
later initialized
  ↓
a → 10
```

This is useful when the value is not known at declaration time.

---

## 16. `const` Does Not Mean Immutable Object

`const` prevents reassignment of the binding, not necessarily modification of the object it references.

```javascript
const user = {
  name: "Pritam"
};

user.name = "Alex";
```

This is allowed.

But:

```javascript
user = {};
```

is not allowed.

Think of it as:

```text
const user
     ↓
reference cannot be reassigned

object
     ↓
its properties may still be changed
```

unless the object is made immutable separately.

---

## 17. Global `var` vs Global `let` / `const`

In a browser classic script, global `var` declarations are linked to properties of the global object. Global `let` and `const` bindings stay in the global lexical environment instead of becoming ordinary global-object properties.

```javascript
var a = 10;
let b = 20;
const c = 30;
```

Conceptually:

```text
Global Object (`window`)
        │
        └── a → 10

Global Lexical Environment
        ├── b → 20
        └── c → 30
```

So `window.a` can access the global `var` property in browser context, while `window.b` and `window.c` do not behave the same way.

---

## 18. TDZ vs Scope

```javascript
{
  console.log(a); // ReferenceError

  let a = 10;
}
```

It is not enough to say that `a` is out of scope.

`a` belongs to the block scope. The actual issue is that it is still in the Temporal Dead Zone.

So:

```text
Scope
→ a belongs to this block

TDZ
→ a cannot be accessed yet
```

This distinction matters.

---

## 19. `typeof` and the TDZ

`typeof` gives `"undefined"` for a completely undeclared identifier:

```javascript
console.log(typeof x);
```

when `x` has never been declared.

But a lexical variable in the TDZ behaves differently:

```javascript
console.log(typeof a);

let a = 10;
```

Result:

```text
ReferenceError
```

Why? Because `a` already exists as a lexical binding but is still uninitialized.

So:

```text
Undeclared x
→ typeof x
→ "undefined"

Lexical a in TDZ
→ typeof a
→ ReferenceError
```

---

## 20. SyntaxError vs ReferenceError vs TypeError

These are different categories of errors.

### SyntaxError

The declaration itself violates JavaScript rules.

```javascript
let a = 10;
let a = 20;
```

Result:

```text
SyntaxError
```

### ReferenceError

The variable is being accessed before it can be resolved or accessed.

```javascript
console.log(a);

let a = 10;
```

Result:

```text
ReferenceError
```

### TypeError

The code attempts an invalid operation on the current value or binding.

```javascript
const a = 10;

a = 20;
```

Result:

```text
TypeError
```

---

## 21. Shadowing With Block Scope

```javascript
var a = 10;

{
  let a = 20;

  console.log(a);
}

console.log(a);
```

Output:

```text
20
10
```

The inner block has its own `a`, which shadows the outer value inside that block.

---

## 22. Example: All Three Declarations

```javascript
var a = 10;

{
  let b = 20;
  const c = 30;

  console.log(a);
  console.log(b);
  console.log(c);
}
```

Inside the block:

```text
a → 10
b → 20
c → 30
```

After the block:

```javascript
console.log(a); // 10
console.log(b); // ReferenceError
console.log(c); // ReferenceError
```

This demonstrates the difference between function/global `var` scope and block scope.

---

## 23. Why TDZ Exists

Consider:

```javascript
let a = 10;
```

JavaScript creates the binding before execution reaches the declaration, but it must also prevent access before initialization actually occurs.

So the sequence is:

```text
Binding creation
      ↓
Uninitialized state
      ↓
TDZ
      ↓
Declaration executes
      ↓
Initialization
      ↓
Normal access
```

The TDZ exists to stop accidental access to a lexical variable before it is ready to be used.

---

## 24. Complete Comparison

### `var`

```javascript
console.log(a);
var a = 10;
```

Output:

```text
undefined
```

### `let`

```javascript
console.log(a);
let a = 10;
```

Result:

```text
ReferenceError
```

### `const`

```javascript
console.log(a);
const a = 10;
```

Result:

```text
ReferenceError
```

Reason:

```text
var
→ initialized to undefined

let / const
→ uninitialized
→ TDZ
```

---

## 25. One Complete Mental Model

```text
                 DECLARATION
                      │
            ┌─────────┼─────────┐
            │         │         │
           var       let       const
            │         │         │
            ↓         ↓         ↓
        created     created   created
            │         │         │
            ↓         ↓         ↓
       undefined   uninitialized
                        │
                        ↓
                       TDZ
                        │
              declaration executes
                        │
                        ↓
                    initialized
                        │
                        ↓
                   normal access
```

---

## 26. Interview Questions

### What is the Temporal Dead Zone?

The Temporal Dead Zone is the period between the creation of a `let` or `const` binding and its initialization. Accessing the variable during this period throws a `ReferenceError`.

### Are `let` and `const` hoisted?

Their bindings are created during environment setup, but unlike `var`, they are not initialized to `undefined`. They remain uninitialized until their declarations execute.

### Why does this throw a `ReferenceError`?

```javascript
console.log(a);
let a = 10;
```

Because `a` exists as a lexical binding but is still uninitialized and therefore in the TDZ.

### Why does `var` give `undefined` instead?

Because the `var` binding is initialized to `undefined` before the assignment executes.

### What is the difference between `let` and `const`?

Both are block-scoped and have a TDZ.

```text
let
→ reassignment allowed
→ initializer optional

const
→ reassignment not allowed
→ initializer required
```

### Can `let` be redeclared?

Not in the same scope.

```javascript
let a = 10;
let a = 20; // SyntaxError
```

### Can `const` be declared without initialization?

No.

```javascript
const a; // SyntaxError
```

### What is the difference between redeclaration and reassignment?

```text
Redeclaration
→ declaring the same binding again

Reassignment
→ changing the value of an existing binding
```

`let` allows reassignment but not same-scope redeclaration.

### Does `const` make an object immutable?

No. `const` prevents reassignment of the binding, not modification of the referenced object's properties.

### Why can `typeof` throw a `ReferenceError`?

It can throw when the identifier exists as a lexical binding but is still in the TDZ.

---

## 27. Key Takeaways

```text
var
→ function-scoped
→ initialized to undefined
→ no TDZ
→ reassignment allowed
→ same-scope redeclaration allowed

let
→ block-scoped
→ uninitialized before declaration
→ TDZ
→ reassignment allowed
→ same-scope redeclaration not allowed

const
→ block-scoped
→ uninitialized before declaration
→ TDZ
→ initializer required
→ reassignment not allowed
→ same-scope redeclaration not allowed
```

### The most important rule

> `let` and `const` bindings are created before execution reaches their declarations, but they cannot be accessed until initialization occurs. The period between creation and initialization is the Temporal Dead Zone.
