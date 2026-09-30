# How JavaScript Code Is Executed and the Call Stack

## 1. What Happens When a JavaScript Program Runs?

When a JavaScript program starts running, a **Global Execution Context (GEC)** is created.

An execution context has two main components:

```text
Execution Context
        │
   ┌────┴────┐
   │         │
Memory    Code
component component
```

The execution context is created in two phases:

```text
Execution Context
      │
      ├── 1. Memory Creation Phase
      │
      └── 2. Code Execution Phase
```

## 2. Memory Creation Phase

During this phase, JavaScript scans the program and allocates memory for the variables and functions it encounters.

Consider:

```js
var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
var square4 = square(4);
```

JavaScript creates memory for:

```text
n
square
square2
square4
```

### Variables

For the variables in this example, JavaScript initially stores:

```text
n       → undefined
square2 → undefined
square4 → undefined
```

`undefined` acts as the initial placeholder in the model taught in this lesson.

### Functions

The function declaration is stored in memory so that it can later be invoked:

```js
function square(num) {
  var ans = num * num;
  return ans;
}
```

Conceptually:

```text
Memory component

n       → undefined
square  → function code
square2 → undefined
square4 → undefined
```

## 3. Code Execution Phase

After the Memory Creation Phase finishes, JavaScript executes the program **line by line**.

For:

```js
n = 2;
```

the value of `n` changes:

```text
n → undefined
```

becomes:

```text
n → 2
```

The overall idea is:

```text
Memory Creation Phase
        ↓
Variables receive initial memory
        ↓
Code Execution Phase
        ↓
Actual values are assigned
```

## 4. Function Invocation Creates a New Execution Context

When JavaScript encounters:

```js
square(n);
```

the function is **invoked**, meaning that it starts executing.

When a function is invoked, JavaScript creates a **new execution context** for that function.

The program now has:

```text
Global Execution Context
        +
Function Execution Context
```

The function's execution context also has a memory component and a code component. Each function call therefore gets its own execution environment.

## 5. Function Execution Context

Suppose:

```js
var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
```

When `square(n)` is called, a new execution context is created for `square`.

During its Memory Creation Phase:

```text
num → undefined
ans → undefined
```

The Code Execution Phase then begins.

## 6. Parameter vs. Argument

Given:

```js
square(n);
```

and:

```js
function square(num) {
  // ...
}
```

- `num` is the **parameter**.
- `n` is the **argument**.

The value of `n` is:

```text
n = 2
```

When the function is called, the value `2` is passed into `num`:

```text
num → 2
```

## 7. Executing the Function

Inside the function:

```js
function square(num) {
  var ans = num * num;
  return ans;
}
```

we initially have:

```text
num → 2
ans → undefined
```

Then JavaScript executes:

```js
var ans = num * num;
```

Since `2 * 2 = 4`, the value becomes:

```text
ans → 4
```

JavaScript then reaches:

```js
return ans;
```

## 8. What Does `return` Do?

The `return` statement tells the function that its work is finished and that a result should be sent back to the place where the function was called.

Here:

```js
return ans;
```

means:

```text
return 4
```

to:

```js
square(n)
```

So:

```text
square(n)
     ↓
     4
```

Therefore:

```text
square2 → 4
```

The function's execution context is then finished.

## 9. Local Memory

The memory belonging to a function's execution context is called its **local memory** in this lesson.

While `square(2)` is executing:

```text
Function Execution Context

Local memory
────────────
num → 2
ans → 4
```

This memory belongs to that particular function execution. After the function finishes, its execution context is removed.

## 10. Multiple Function Calls

Now consider:

```js
var square2 = square(n);
var square4 = square(4);
```

There are two separate function invocations.

### First call

```js
square(n);
```

This creates one execution context and eventually returns `4`:

```text
square2 → 4
```

### Second call

```js
square(4);
```

This creates another execution context. This time:

```text
num → 4
ans → 16
```

and:

```text
square4 → 16
```

Each invocation gets its **own execution context**.

## 11. The Call Stack

The **Call Stack** manages execution contexts and keeps track of the order in which they should execute.

Think of it as a stack:

```text
        ┌────────────────────────┐
        │ Function Execution     │
        │ Context                │
        ├────────────────────────┤
        │ Global Execution       │
        │ Context                │
        └────────────────────────┘
```

The stack follows **LIFO: Last In, First Out**.

## 12. The Global Execution Context Goes First

When a JavaScript program starts, the Global Execution Context is created and pushed onto the Call Stack:

```text
Call Stack
──────────
GEC
```

JavaScript then begins executing the program.

## 13. Function Call: Push

When JavaScript encounters:

```js
square(n);
```

a new execution context is created and pushed onto the Call Stack:

```text
Call Stack
──────────
square()
GEC
```

JavaScript now executes `square()`.

## 14. Function Finished: Pop

When `square()` reaches:

```js
return ans;
```

its work is finished, so its execution context is removed from the Call Stack. This is called **popping** the execution context.

Before:

```text
Call Stack
──────────
square()
GEC
```

After:

```text
Call Stack
──────────
GEC
```

Control returns to the point where the function was called.

## 15. Complete Flow

For this example:

```js
var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
var square4 = square(4);
```

the overall process is:

```text
Program starts
      ↓
Global Execution Context created
      ↓
GEC pushed onto Call Stack
      ↓
Memory Creation Phase
      ↓
Code Execution Phase
      ↓
square(n) invoked
      ↓
New Function Execution Context created
      ↓
Function context pushed onto Call Stack
      ↓
Function executes
      ↓
return ans
      ↓
Function context popped
      ↓
Control returns to GEC
      ↓
square(4) invoked
      ↓
Another Function Execution Context created
      ↓
Function context pushed
      ↓
Function executes
      ↓
return ans
      ↓
Function context popped
      ↓
Control returns to GEC
      ↓
Program finishes
      ↓
GEC removed
      ↓
Call Stack becomes empty
```

## 16. Why Do We Need the Call Stack?

The Call Stack maintains the **order of execution of execution contexts**.

It answers:

> Which execution context is currently executing?

For example, if the call sequence is:

```text
GEC
 ↓
function A()
 ↓
function B()
```

the stack tracks the nesting like this:

```text
B()
A()
GEC
```

When `B()` finishes:

```text
A()
GEC
```

When `A()` finishes:

```text
GEC
```

When the whole program finishes:

```text
(empty)
```

This is the main responsibility of the Call Stack.

## 17. Other Names for the Call Stack

You may see several names for the same concept:

- Call Stack
- Execution Context Stack
- Program Stack
- Control Stack
- Runtime Stack
- Machine Stack

For this topic, treat them as referring to the same stack concept.

## 18. Important Mental Model

Keep this model in mind:

```text
JavaScript program
       ↓
Global Execution Context
       ↓
Call Stack
       ↓
Function call
       ↓
New execution context
       ↓
Push onto Call Stack
       ↓
Function executes
       ↓
Return
       ↓
Execution context popped
       ↓
Control returns to previous context
```

## 19. Key Terms to Remember

| Term | Meaning |
| --- | --- |
| Execution context | Environment in which JavaScript code executes |
| Global Execution Context | Execution context created when the program starts |
| Memory Creation Phase | Phase where memory is allocated |
| Code Execution Phase | Phase where code executes line by line |
| Function Execution Context | Execution context created when a function is invoked |
| Parameter | Variable defined in the function declaration |
| Argument | Actual value passed during the function call |
| Local memory | Memory associated with a function's execution context |
| Call Stack | Stack that manages execution contexts |
| Push | Add an execution context to the Call Stack |
| Pop | Remove an execution context after execution finishes |

## 20. Interview Questions

### What happens when JavaScript code starts executing?

A Global Execution Context is created. It goes through a Memory Creation Phase followed by a Code Execution Phase. The Global Execution Context is also pushed onto the Call Stack.

### What happens when a function is invoked?

A new execution context is created for that function and pushed onto the Call Stack.

### What happens when a function finishes?

Its execution context is removed from the Call Stack, and control returns to the previous execution context.

### What is the Call Stack?

The Call Stack keeps track of execution contexts and maintains their execution order.

### What is the difference between a parameter and an argument?

```js
function square(num) {}
```

`num` is the parameter.

```js
square(2);
```

`2` is the argument.

### Why does every function call get a new execution context?

Every invocation represents a separate execution of the function and needs its own memory and code execution environment.

## 21. The Most Important Ideas

Memorize this flow:

```text
Execution Context
       ↓
Two phases
       ↓
┌─────────────────────┐
│ Memory Creation     │
│ Phase               │
└─────────────────────┘
       ↓
┌─────────────────────┐
│ Code Execution      │
│ Phase               │
└─────────────────────┘
```

And:

```text
Program starts
      ↓
GEC created
      ↓
GEC pushed to Call Stack
      ↓
Function invoked
      ↓
New Execution Context
      ↓
Push
      ↓
Function executes
      ↓
Return
      ↓
Pop
      ↓
Previous context resumes
```

### One-line summary

**JavaScript creates execution contexts to execute code, and the Call Stack manages those contexts in the correct order.**
