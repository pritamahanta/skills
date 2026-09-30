# JavaScript Execution Context

## 1. Core Idea

The fundamental idea is:

> Everything in JavaScript happens inside an execution context.

An **execution context** is the environment or container in which JavaScript code is executed.

```text
Execution Context
        │
   ┌────┴────┐
   │         │
Memory    Code
component component
```

## 2. Components of an Execution Context

An execution context has two main components:

### Memory component

The memory component is where JavaScript stores:

- Variables
- Functions

They are stored as key-value pairs.

For example:

```js
var a = 10;
```

Conceptually:

```text
Memory
  a → 10
```

The memory component is also called the **variable environment**.

```text
Memory component
        ↓
Variable environment
```

### Code component

The code component is where JavaScript code is executed. The code is executed one line at a time.

The code component is also called the **thread of execution**.

```text
Code component
       ↓
Thread of execution
```

## 3. The Complete Execution Context

Putting the two components together:

```text
                    Execution Context
                           │
             ┌─────────────┴─────────────┐
             │                           │
       Memory component             Code component
             │                           │
      Variable environment        Thread of execution
             │                           │
      Stores variables             Executes code
       and functions              one line at a time
```

This is the main mental model:

- The **memory component** stores variables and functions.
- The **code component** executes the code one line at a time.

## 4. JavaScript Is Single-Threaded

JavaScript is a **single-threaded language**.

Single-threaded means that JavaScript can execute one command at a time.

For example:

```js
console.log("A");
console.log("B");
console.log("C");
```

Execution happens in this order:

```text
A
↓
B
↓
C
```

Multiple JavaScript commands are not executed simultaneously on the same thread.

## 5. JavaScript Is Synchronous

JavaScript is also described as **synchronous**.

Synchronous execution means that JavaScript follows a specific order and moves to the next line after the current line has finished executing.

For example:

```js
console.log("A");
console.log("B");
```

Conceptually:

```text
Execute A
   ↓
A finishes
   ↓
Execute B
```

JavaScript does not skip ahead and execute `B` before `A` has completed.

## 6. Synchronous and Single-Threaded

These terms describe different aspects of execution:

| Term | Question it answers | Meaning |
| --- | --- | --- |
| Single-threaded | How many things can JavaScript execute at the same time? | One at a time |
| Synchronous | How is execution ordered? | In a specific sequence; the next operation waits for the current one to finish |

Together:

```text
+ JavaScript
      │
      ├── Single-threaded
      │      └── One command at a time
      │
      └── Synchronous
             └── Executes in a specific order
```

The key statement is:

> JavaScript is a synchronous, single-threaded language.

## 7. What About Asynchronous JavaScript?

A natural question is: if JavaScript is synchronous, what about things such as Ajax, where we hear the word *asynchronous*?

The mechanism behind asynchronous behavior is covered later in the series. For this topic, remember only:

```text
JavaScript itself
        ↓
Synchronous + single-threaded

Asynchronous behavior
        ↓
Explained in later topics
```

Do not mix later Event Loop, Web API, or callback-queue concepts into this note yet.

## 8. Important Terminology

| Term | Meaning |
| --- | --- |
| Execution context | Environment or container in which JavaScript code executes |
| Memory component | Stores variables and functions |
| Variable environment | Another name for the memory component |
| Code component | Where code is executed |
| Thread of execution | Another name for the code component |
| Single-threaded | Executes one command at a time |
| Synchronous | Executes operations in a specific order |

These are the key terms introduced in this topic.

## 9. One Simple Mental Model

Whenever you see JavaScript code, initially think:

```text
JavaScript program
       ↓
Execution context
       ↓
┌─────────────────┐
│ Memory          │ → variables + functions
│                 │
│ Code            │ → executes code
└─────────────────┘
```

Remember:

```text
JavaScript
= Single-threaded
+ Synchronous
```

## 10. Interview Questions

### What is an execution context?

An execution context is the environment or container in which JavaScript code is executed. It contains a memory component for storing variables and functions and a code component where the code is executed.

### What are the two components of an execution context?

1. Memory component
2. Code component

### What is the memory component?

It is the part of the execution context where variables and functions are stored as key-value pairs. It is also called the variable environment.

### What is the code component?

It is the part where JavaScript code is executed one line at a time. It is also called the thread of execution.

### Why is JavaScript called single-threaded?

Because it executes one command at a time.

### Why is JavaScript called synchronous?

Because execution follows a specific order, with the next operation proceeding after the current one has finished.

## What You Should Remember

```text
                    EXECUTION CONTEXT
                           │
              ┌────────────┴────────────┐
              │                         │
           MEMORY                      CODE
              │                         │
      Variable environment       Thread of execution
              │                         │
      variables + functions       executes code

JavaScript → Synchronous + single-threaded
```

This is the conceptual foundation for the topic. The next lesson demonstrates how an actual JavaScript program runs and how its execution context is created.
