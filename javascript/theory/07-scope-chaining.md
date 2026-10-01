# Scope, Lexical Environment & Scope Chain

## 1. Scope

Scope tells us where a variable or function can be accessed.

```javascript
var b = 10;

function a() {
  console.log(b);
}

a();
```

Here, `b` is declared outside `a()`, but `a()` can still access it.

Output:

```text
10
```

So scope answers:

> Where is a variable or function accessible?

A useful way to think about it:

- What is the scope of `b`?
- Is `b` inside the scope of `a`?

---

## 2. Scope Is Determined Lexically

Scope is based on the lexical structure of the code, meaning where the code is written in the source.

```javascript
var b = 10;

function a() {
  function c() {
    console.log(b);
  }

  c();
}

a();
```

The nesting is:

```text
Global
  ↓
  a
  ↓
  c
```

Here, `c` is written inside `a`, and `a` is written in the global code. This physical relationship is what lexical scope means.

---

## 3. Lexical

The word lexical refers to the position or structure of code in the source.

```javascript
var b = 10;

function a() {
  function c() {
    console.log(b);
  }
}
```

We can say:

- `c` is lexically inside `a`
- `a` is lexically inside the global scope

So:

```text
Lexical Parent of c → a
Lexical Parent of a → Global
```

Important: scope is determined by where the function is defined, not by who calls it.

---

## 4. Lexical Environment

Whenever an execution context is created, a lexical environment is also created.

A useful model is:

```text
Lexical Environment
  =
Local Memory
+
Reference to Parent Lexical Environment
```

Conceptually:

```text
┌─────────────────────────────┐
│      Lexical Environment    │
│                             │
│  Local Memory               │
│  +                          │
│  Reference to outer         │
│  Lexical Environment        │
└─────────────────────────────┘
```

This reference to the outer environment is what allows JavaScript to access variables outside the current scope.

---

## 5. Example of Lexical Environments

```javascript
var b = 10;

function a() {
  function c() {
    console.log(b);
  }

  c();
}

a();
```

Conceptually:

```text
Global Lexical Environment
│
│ b → 10
│ a → function
│
└──→ null


a's Lexical Environment
│
│ c → function
│
└──→ Global Lexical Environment


c's Lexical Environment
│
│ local variables/functions
│
└──→ a's Lexical Environment
```

This creates a chain:

```text
c
↓
a
↓
Global
↓
null
```

This chain is the foundation of the scope chain.

---

## 6. Outer Environment Reference

Each lexical environment stores a reference to its lexical parent.

```text
C's Lexical Environment
        ↓
A's Lexical Environment
        ↓
Global Lexical Environment
        ↓
null
```

The global lexical environment has no parent, so its outer reference is:

```text
null
```

Conceptually:

```text
Global → null
A      → Global
C      → A
```

---

## 7. Variable Lookup

Now consider:

```javascript
var b = 10;

function a() {
  function c() {
    console.log(b);
  }

  c();
}

a();
```

When JavaScript reaches `console.log(b)` inside `c()`, it looks for `b`.

It starts in the current lexical environment and moves outward.

### Step 1: Search `c`

```text
c's local environment
        ↓
Is b present?
        ↓
No
```

### Step 2: Move to `a`

```text
a's lexical environment
        ↓
Is b present?
        ↓
No
```

### Step 3: Move to global

```text
Global lexical environment
        ↓
Is b present?
        ↓
Yes → b = 10
```

So the result is:

```text
10
```

---

## 8. Lookup Always Moves Outward

The rule is:

```text
Current Environment
        ↓
Parent Environment
        ↓
Parent's Parent
        ↓
...
        ↓
Global Environment
        ↓
null
```

JavaScript searches from the inside outward. It does not search all variables randomly.

---

## 9. Scope Chain

The chain of lexical environments is called the scope chain.

Example:

```text
C
↓
A
↓
Global
↓
null
```

When JavaScript cannot find a variable in the current environment, it follows this chain until it either:

- finds the variable, or
- reaches `null`

---

## 10. Example: Variable Found in Parent

```javascript
var b = 10;

function a() {
  console.log(b);
}

a();
```

Lookup:

```text
a's environment
      ↓
b not found
      ↓
Global environment
      ↓
b found
      ↓
10
```

Output:

```text
10
```

---

## 11. Example: Variable Found in Grandparent

```javascript
var b = 10;

function a() {
  function c() {
    console.log(b);
  }

  c();
}

a();
```

Lookup:

```text
c
↓
b not found

a
↓
b not found

Global
↓
b found

→ 10
```

This shows that a function can access variables from multiple outer levels.

---

## 12. Variable Does Not Exist

```javascript
function a() {
  function c() {
    console.log(b);
  }

  c();
}

a();
```

If `b` is not declared anywhere, the lookup goes:

```text
c
↓
b not found

a
↓
b not found

Global
↓
b not found

null
↓
Search ends
```

Then JavaScript throws:

```text
ReferenceError: b is not defined
```

---

## 13. Scope Is Not Determined by Function Calls

This distinction is important.

```javascript
var x = 10;

function a() {
  function c() {
    console.log(x);
  }

  c();
}

a();
```

`c` can access `x` because of where `c` is defined, not simply because `a()` called it.

The lexical parent depends on source-code structure, not call order.

This is why the term lexical scope is used.

---

## 14. Local Memory vs Lexical Environment

These are related but not identical.

### Local Memory

Contains variables and functions for the current execution context.

### Lexical Environment

Includes:

- local bindings
- a reference to the outer lexical environment

So:

```text
Lexical Environment
├── Local bindings
└── Outer environment reference
```

The outer reference is what makes scope-chain lookup possible.

---

## 15. Global Lexical Environment

At the top level:

```text
Global Lexical Environment
        ↓
Outer environment = null
```

There is no lexical parent above the global environment. The lookup chain eventually ends at `null`.

---

## 16. Nested Functions

Nested functions make scope chains easy to see.

```javascript
var a = 10;

function outer() {
  var b = 20;

  function inner() {
    var c = 30;

    console.log(a);
    console.log(b);
    console.log(c);
  }

  inner();
}

outer();
```

Conceptually:

```text
Global
│
│ a = 10
│
└── outer
     │
     │ b = 20
     │
     └── inner
          │
          │ c = 30
          │
          └── null
```

When `inner()` looks for variables:

```text
c → found in inner
b → found in outer
a → found in global
```

So output is:

```text
30
20
10
```

---

## 17. Scope Chain Lookup Algorithm

When JavaScript encounters a variable:

```text
variableName
```

the lookup process is:

```text
1. Search current lexical environment
2. Found?
   ├── Yes → use it
   └── No → continue
3. Follow outer environment reference
4. Search parent lexical environment
5. Repeat until...
6. Reaches global environment
7. Still not found?
8. Reaches null
9. Throw ReferenceError
```

This is the scope-chain lookup mechanism.

---

## 18. Shadowing

Consider:

```javascript
var b = 10;

function a() {
  var b = 20;

  function c() {
    var b = 30;
    console.log(b);
  }

  c();
}
```

There are three different `b` bindings:

```text
Global → 10
a      → 20
c      → 30
```

Inside `c`, the local `b` shadows the outer ones.

So:

```javascript
console.log(b);
```

uses:

```text
c's b → 30
```

This is called shadowing.

---

## 19. If the Local Variable Is Not Present

```javascript
var b = 10;

function a() {
  var b = 20;

  function c() {
    console.log(b);
  }

  c();
}

a();
```

Inside `c`, there is no local `b`, so JavaScript checks outward:

```text
c → no b

a → b = 20 -> found
```

Output:

```text
20
```

If `b` also does not exist in `a`, then it reaches global:

```text
Global → b = 10
```

Output:

```text
10
```

---

## 20. Scope Chain vs Call Stack

These are different concepts.

### Call Stack

Tracks execution contexts currently active.

Example:

```text
C()
A()
Global
```

### Scope Chain

Determines where JavaScript searches for variables.

Example:

```text
C
↓
A
↓
Global
↓
null
```

They may look similar in nested code, but they serve different purposes:

- Call Stack → execution order
- Scope Chain → variable lookup

---

## 21. Execution Context + Lexical Environment

When a function is invoked, a new execution context is created. That execution context has its own lexical environment and a reference to its outer lexical environment.

Conceptually:

```text
Function a Execution Context
        │
        ▼
Lexical Environment
        │
        ├── b → 10
        │
        └── outer reference
                 ↓
          Parent Lexical Environment
```

This connection allows a function to access variables outside itself when appropriate.

---

## 22. Example: Accessing an Outer Variable

```javascript
var b = 10;

function a() {
  console.log(b);
}

a();
```

`b` is not inside `a`, so JavaScript follows:

```text
a
↓
Global
↓
b = 10
```

and prints:

```text
10
```

---

## 23. Three-Level Example

```javascript
var x = 1;

function a() {
  var y = 2;

  function b() {
    var z = 3;

    function c() {
      console.log(x);
      console.log(y);
      console.log(z);
    }

    c();
  }

  b();
}

a();
```

The scope chain of `c` is:

```text
c
↓
b
↓
a
↓
Global
↓
null
```

Lookup:

```text
x → Global
y → a
z → b
```

---

## 24. Closure Connection

A nested function can retain access to the lexical environment of its outer function.

```javascript
function a() {
  var b = 10;

  function c() {
    console.log(b);
  }

  c();
}
```

Here, `c` has access to `a`'s lexical environment. This is an important foundation for closures.

The key idea is:

```text
Function + surrounding lexical environment
```

---

## 25. Browser DevTools Mental Model

When debugging in browser DevTools, the call stack shows active execution contexts.

```javascript
function a() {
  function c() {
    debugger;
  }

  c();
}

a();
```

Call stack:

```text
c
a
Global
```

At the same time, variable lookup still follows lexical relationships:

```text
c
↓
a
↓
Global
```

The debugger can expose both the active execution context and the variables available through the scope chain.

---

## 26. Common Mistakes

### Mistake 1: “If a variable is outside the function, it is inaccessible.”

Wrong:

```javascript
var x = 10;

function a() {
  console.log(x);
}
```

`a` can access `x` through the scope chain.

### Mistake 2: “JavaScript searches every variable in the program.”

No. It follows a precise chain:

```text
Current → Parent → Parent → ... → Global → null
```

### Mistake 3: “Scope chain and call stack are the same.”

No. They serve different purposes:

- Call Stack → execution flow
- Scope Chain → variable lookup

### Mistake 4: “The caller determines the scope.”

No. The lexical parent depends on where the function is written in the source.

### Mistake 5: “If JavaScript does not find a variable locally, it immediately throws an error.”

No. It searches outward first. Only after the chain ends does it throw a `ReferenceError`.

---

## 27. Important Definitions

### Scope

The region of code in which a variable or function is accessible.

### Lexical

Related to the physical structure or hierarchy of the source code.

### Lexical Environment

The environment that holds local bindings and a reference to the outer lexical environment.

### Outer Environment Reference

The reference connecting a lexical environment to its parent lexical environment.

### Scope Chain

The chain of lexical environments followed during variable lookup.

### Lexical Parent

The environment corresponding to where a function or code block is nested in the source.

---

## 28. One Complete Example

```javascript
var a = 10;

function outer() {
  var b = 20;

  function inner() {
    var c = 30;

    console.log(a);
    console.log(b);
    console.log(c);
  }

  inner();
}

outer();
```

### Lexical environments

```text
Global
├── a = 10
└── outer

outer
├── b = 20
└── inner

inner
└── c = 30
```

### Scope chain of `inner`

```text
inner
 ↓
outer
 ↓
Global
 ↓
null
```

### Lookup

```text
console.log(c) → inner finds c → 30
console.log(b) → inner misses, outer finds b → 20
console.log(a) → inner misses, outer misses, global finds a → 10
```

Output:

```text
10
20
30
```

---

## 29. Final Mental Model

```text
                 LEXICAL ENVIRONMENTS

Global
  │
  │ outer → null
  │
  └── A
       │
       │ outer → Global
       │
       └── C
            │
            │ outer → A
            │
            └── local variables
```

When a variable is requested inside `C`:

```text
Search C
   ↓
Found?
   ├── Yes → use it
   └── No
        ↓
Search A
   ↓
Found?
   ├── Yes → use it
   └── No
        ↓
Search Global
   ↓
Found?
   ├── Yes → use it
   └── No
        ↓
null
        ↓
ReferenceError
```

---

## 30. What To Remember

```text
1. Scope = where a variable or function can be accessed.
2. Scope is determined lexically.
3. Lexical means based on the structure and position of the code.
4. Every execution context has a lexical environment.
5. A lexical environment contains local bindings and a reference to its outer lexical environment.
6. The global environment's outer reference is null.
7. When a variable is not found locally, JavaScript searches outward through the scope chain.
8. The full chain is: Local → Parent → Parent → ... → Global → null
9. If a matching variable is found, lookup stops.
10. If the chain ends without a match, JavaScript throws a ReferenceError.
11. Scope chain and call stack are different: execution order vs variable lookup.
12. Lexical parent depends on where the code is written, not simply who calls the function.
```

### Core rule

> JavaScript resolves a variable by searching the current lexical environment first and then moving outward through its lexical parents until it finds the variable or reaches the end of the scope chain.

```text
Execution Context
        ↓
Lexical Environment
        ↓
Local bindings
+
Outer Environment Reference
        ↓
Scope Chain
        ↓
Variable Lookup
```
