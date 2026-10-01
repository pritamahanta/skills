# How Functions Work in JavaScript and the Variable Environment

## 1. Core Idea

A function call creates a **new execution context**.

That execution context has its own:

```text
Memory
  +
Code
```

Therefore, every function invocation gets its own local environment.

This lesson demonstrates the idea using the same variable name, `x`, in the global scope and in functions `a` and `b`. All three `x` variables are independent.

## 2. The Central Example

```js
var x = 1;

a();
b();

console.log(x);

function a() {
  var x = 10;
  console.log(x);
}

function b() {
  var x = 100;
  console.log(x);
}
```

Output:

```text
10
100
1
```

This is the central example for the lesson.

## 3. Why Is the Output `10`, `100`, `1`?

There are multiple variables named `x`, so how does JavaScript know which one to use?

The answer is:

> Each execution context has its own memory space.

Conceptually:

```text
Global Execution Context
x → 1

Function a Execution Context
x → 10

Function b Execution Context
x → 100
```

These are separate variables, even though they have the same name.

## 4. Global Execution Context

When the program starts, JavaScript creates a **Global Execution Context (GEC)**.

It contains:

```text
Global Execution Context
│
├── Memory Component
│
└── Code Component
```

The memory component is also called the **variable environment**.

During the Memory Creation Phase:

```text
x → undefined
a → function
b → function
```

The functions are available in memory, while the `var` variable initially has the value `undefined`.

## 5. The Call Stack

The Global Execution Context is pushed onto the **Call Stack** when the program begins:

```text
Call Stack
──────────
Global EC
```

The Call Stack keeps track of which execution context is currently executing.

## 6. The First Statement: `x = 1`

The first statement is:

```js
var x = 1;
```

Memory already contained:

```text
x → undefined
```

During code execution, the value changes:

```text
x → 1
```

The global execution context now contains:

```text
Global memory
─────────────
x → 1
a → function
b → function
```

## 7. Function `a()` Is Invoked

The next statement is:

```js
a();
```

When `a()` is called, a brand-new execution context is created for `a` and pushed onto the Call Stack:

```text
Call Stack
──────────
a()
Global EC
```

This execution context is specific to function `a`.

## 8. Function `a` Has Its Own Memory

Inside:

```js
function a() {
  var x = 10;
  console.log(x);
}
```

there is another variable named `x`.

During the Memory Creation Phase of `a`:

```text
a's local memory
────────────────
x → undefined
```

This is not the same `x` as the global `x`. It belongs to `a`'s execution context.

```text
Global memory
x → 1

        ≠

a's local memory
x → undefined
```

## 9. `x = 10` Inside `a`

The next line executes:

```js
x = 10;
```

Inside `a`'s local memory:

```text
x → undefined
```

becomes:

```text
x → 10
```

Now the two variables are:

```text
Global memory
x → 1

a's local memory
x → 10
```

Both are named `x`, but they are completely separate.

## 10. `console.log(x)` Inside `a`

When this executes:

```js
console.log(x);
```

JavaScript looks for `x` in the local memory of the current execution context. It finds:

```text
x → 10
```

Therefore, it prints:

```text
10
```

## 11. What Happens When `a()` Finishes?

Once all code inside `a()` has executed, `a`'s execution context is removed from the Call Stack.

Before:

```text
Call Stack
──────────
a()
Global EC
```

After:

```text
Call Stack
──────────
Global EC
```

Control returns to the Global Execution Context at the point where `a()` was called.

For the execution model taught in this lesson, the completed function execution context is treated as gone along with its local memory.

## 12. Function `b()` Is Invoked

Next, the program reaches:

```js
b();
```

A new execution context is created for `b` and pushed onto the stack:

```text
Call Stack
──────────
b()
Global EC
```

Again, `b` receives its own memory.

## 13. Function `b` Has Its Own `x`

Inside:

```js
function b() {
  var x = 100;
  console.log(x);
}
```

during memory creation:

```text
b's local memory
────────────────
x → undefined
```

Then:

```js
x = 100;
```

changes it to:

```text
x → 100
```

## 14. `console.log(x)` Inside `b`

JavaScript searches the current local memory:

```text
b's local memory
x → 100
```

Therefore:

```js
console.log(x);
```

prints:

```text
100
```

It does not print the global value `1`, because `b` has its own `x`.

## 15. `b()` Finishes

After `b()` finishes executing, its execution context is removed from the Call Stack.

Before:

```text
Call Stack
──────────
b()
Global EC
```

After:

```text
Call Stack
──────────
Global EC
```

Control returns to the Global Execution Context.

## 16. The Final `console.log(x)`

The program now reaches:

```js
console.log(x);
```

This statement is executed in the Global Execution Context, where:

```text
x → 1
```

Therefore, the output is:

```text
1
```

The local `x` variables inside `a` and `b` did not change the global `x`.

## 17. Complete Execution Flow

The entire program can be visualized as:

```text
Program starts
      ↓
Global Execution Context created
      ↓
GEC pushed onto Call Stack
      ↓
Memory Creation Phase
      ↓
x → undefined
      ↓
a → function
      ↓
b → function
      ↓
Code Execution Phase
      ↓
x = 1
      ↓
a()
      ↓
Create a's Execution Context
      ↓
Push a onto Call Stack
      ↓
a's local x → undefined
      ↓
x = 10
      ↓
console.log(x) → 10
      ↓
a finishes
      ↓
Pop a
      ↓
Back to GEC
      ↓
b()
      ↓
Create b's Execution Context
      ↓
Push b onto Call Stack
      ↓
b's local x → undefined
      ↓
x = 100
      ↓
console.log(x) → 100
      ↓
b finishes
      ↓
Pop b
      ↓
Back to GEC
      ↓
console.log(x) → 1
      ↓
Program finishes
      ↓
GEC removed
```

This is the main execution model demonstrated in the lesson.

## 18. The Most Important Concept: Separate Local Memory

Consider:

```js
var x = 1;

function a() {
  var x = 10;
}

function b() {
  var x = 100;
}
```

There are conceptually three different variables:

```text
Global:
x → 1

a():
x → 10

b():
x → 100
```

The identical name does not make them the same variable. Each function invocation gets its own local environment.

## 19. Execution Contexts Are Independent

A function's execution context is an independent, small environment in which that function's code executes.

```text
Global EC
   │
   └── Global memory

Function a EC
   │
   └── Local memory

Function b EC
   │
   └── Local memory
```

Each environment has its own variables.

## 20. Local Memory

**Local memory** means memory belonging to the currently executing function's execution context.

For `a()`:

```text
a local memory
x → 10
```

For `b()`:

```text
b local memory
x → 100
```

For the global context:

```text
Global memory
x → 1
```

This distinction is fundamental for understanding JavaScript scope. These ideas also build toward scope and closures.

## 21. Important Rule From This Lesson

When JavaScript evaluates a variable reference inside a function, the first place to look is the **local memory of the current execution context**.

For:

```js
function a() {
  var x = 10;
  console.log(x);
}
```

The engine finds `x` locally:

```text
a local memory
x → 10
```

so it uses `10`.

The broader rules for what happens when a variable is not found locally are covered in later scope and lexical-environment material. Do not mix that topic into this lesson yet.

## 22. Relationship With the Previous Lessons

The concepts now connect.

### Lesson 1

Introduced:

```text
Execution Context
├── Memory
└── Code
```

and:

```text
JavaScript
= Synchronous
+ Single-threaded
```

### Lesson 2

Introduced:

```text
Execution Context
        ↓
Call Stack
```

and explained that function calls create and remove execution contexts.

### Lesson 3

Explained:

```text
Memory Creation Phase
        ↓
Hoisting
```

### This lesson

Combines these ideas:

```text
Function invocation
        ↓
New execution context
        ↓
New local memory
        ↓
Own variables
        ↓
Push to Call Stack
        ↓
Execute
        ↓
Pop
```

This progression is important because the next concepts, especially **scope and closures**, build on this model.

## 23. Browser DevTools Demonstration

The lesson also demonstrates these concepts using the browser debugger.

When the program is paused, DevTools shows:

```text
Call Stack
```

and the current execution context.

When `a()` is executing, you can see:

```text
Global memory
+
a's local memory
```

When `a()` finishes, it disappears from the Call Stack and execution returns to the global context. The same happens for `b()`.

This is useful because the diagrams correspond to actual debugger behavior.

## 24. Common Confusion

### “There are three `x` variables. Doesn't JavaScript overwrite them?”

No. These are different variables:

```text
Global x
a's x
b's x
```

Their names are the same, but they belong to different execution contexts.

### “Why doesn't `a` change the global `x`?”

Because:

```js
function a() {
  var x = 10;
}
```

declares a new local variable `x`. It does not modify the global variable.

### “Why does the final `console.log(x)` print `1`?”

Because `a` and `b` have already finished, and the final statement executes in the Global Execution Context:

```text
Global x → 1
```

The local variables belonged to their respective function execution contexts.

## 25. Interview Questions

### What happens when a function is called in JavaScript?

A new execution context is created for that function and pushed onto the Call Stack.

### Does every function call get its own memory?

Yes. Each function invocation gets its own execution context and therefore its own local memory.

### Can two functions have variables with the same name?

Yes:

```js
function a() {
  var x = 10;
}

function b() {
  var x = 100;
}
```

These `x` variables belong to different function execution contexts.

### Why does this output occur?

```js
var x = 1;

function a() {
  var x = 10;
  console.log(x);
}

function b() {
  var x = 100;
  console.log(x);
}

a();
b();
console.log(x);
```

Output:

```text
10
100
1
```

Each function has its own local `x`, while the final `console.log()` executes in the global context.

### What happens to a function's execution context after it finishes?

It is removed from the Call Stack, and the function's execution is complete. This lesson models its local execution environment as going away after completion.

### What is local memory?

Local memory is the memory associated with the current function's execution context.

### What is a variable environment?

In the terminology used in this series, it refers to the memory component where variables and functions associated with an execution context are stored.

## 26. The One Diagram to Remember

```text
                  CALL STACK
              ┌───────────────┐
              │    a()        │
              ├───────────────┤
              │ Global EC     │
              └───────────────┘


Global EC
┌─────────────────────┐
│ x → 1               │
└─────────────────────┘


a() EC
┌─────────────────────┐
│ x → 10              │
└─────────────────────┘


b() EC
┌─────────────────────┐
│ x → 100             │
└─────────────────────┘
```

Only one function execution context is at the top of the Call Stack at a time. When that function completes, it is popped and control returns to the previous context.

## 27. What You Should Remember

```text
1. Program starts
        ↓
2. Global Execution Context created
        ↓
3. GEC pushed onto Call Stack
        ↓
4. Function called
        ↓
5. New Execution Context created
        ↓
6. New local memory created
        ↓
7. Function executes
        ↓
8. Function finishes
        ↓
9. Function EC popped
        ↓
10. Previous EC continues
```

The most important idea is:

```text
Same variable name
        ≠
Same variable

Different Execution Context
        ↓
Different Local Memory
        ↓
Different Variables
```

## Final Takeaway

**Every function invocation gets its own execution context and local memory. Therefore, variables with the same name in different functions are independent from each other. The Call Stack manages these execution contexts as functions are called and completed.**
