# JavaScript Engine and V8 Architecture

## 1. JavaScript Runtime Environment

A **JavaScript Runtime Environment (JSRE)** provides everything needed to execute JavaScript.

JavaScript can run in browsers, Node.js, and environments such as smartwatches or robots. A runtime generally includes:

- a JavaScript engine
- runtime or Web APIs
- a Call Stack
- a Memory Heap
- callback and microtask queues
- an Event Loop

The exact APIs depend on the environment.

### Browser vs. Node.js

The JavaScript engine executes JavaScript, while the surrounding runtime supplies environment-specific capabilities.

| Environment | Examples of additional capabilities |
|---|---|
| Browser | DOM, `fetch()`, `localStorage`, timers |
| Node.js | File system access, server-side networking, timers |

Conceptually:

```text
JavaScript Runtime
├── JavaScript Engine
│   ├── Call Stack
│   ├── Memory Heap
│   └── Garbage Collector
├── Runtime APIs
├── Callback Queue
├── Microtask Queue
└── Event Loop
```

---

## 2. JavaScript Engines

A JavaScript engine is software, not a physical machine. It is usually implemented in a lower-level language such as C++ and converts JavaScript source code into instructions the computer can execute.

The **ECMAScript specification** defines the rules of the language. Different engines implement those rules using different internal techniques.

Examples include:

- **V8:** used by Chrome and Node.js
- **SpiderMonkey:** used by Firefox
- **JavaScriptCore:** used by Safari
- **Chakra:** a historical engine associated with Internet Explorer and older Microsoft Edge

---

## 3. How a JavaScript Engine Works

A simplified engine pipeline is:

```text
JavaScript source code
        ↓
Parsing
        ↓
Abstract Syntax Tree
        ↓
Interpretation and compilation
        ↓
Execution
```

The engine also manages memory during execution.

### 3.1 Parsing

Parsing converts source code into a structured representation.

#### Tokenization

The source is divided into tokens.

```javascript
let a = 7;
```

Possible tokens include:

```text
let, a, =, 7, ;
```

#### Abstract Syntax Tree

The parser uses the tokens to build an **Abstract Syntax Tree (AST)**. The AST represents the structure and relationships within the program so the engine can understand what the code means.

### 3.2 Compilation and execution

Modern engines combine interpretation and compilation. They can begin executing code quickly, collect information while the program runs, and optimize frequently executed code.

This runtime approach is called **Just-In-Time (JIT) compilation**.

---

## 4. Interpreter vs. Compiler

| Interpreter | Compiler |
|---|---|
| Processes and executes code incrementally | Translates code into another executable form during compilation |
| Can begin execution quickly | Can produce highly optimized code |
| Usually performs less whole-program optimization | Can apply extensive optimizations |

Modern JavaScript engines combine both approaches rather than fitting neatly into only one category.

### JIT Compilation

A simplified JIT process is:

1. The engine parses the source code.
2. An interpreter converts the parsed representation into bytecode.
3. The engine executes the bytecode.
4. Runtime information is collected as the program runs.
5. Frequently executed code is compiled into optimized machine code.
6. Later executions can use the optimized code.

Therefore, it is inaccurate to describe modern JavaScript simply as an interpreted language.

---

## 5. Execution and Memory Management

During execution, the engine manages both control flow and memory.

### Call Stack

The Call Stack tracks active execution contexts and the order in which functions execute. It follows the **Last In, First Out (LIFO)** principle.

### Memory Heap

The Memory Heap provides space for dynamically allocated data such as objects.

### Garbage Collector

The garbage collector reclaims memory occupied by objects that are no longer reachable from the program.

```text
Execution
├── Call Stack → execution contexts and order
├── Memory Heap → dynamically allocated data
└── Garbage Collector → unreachable memory cleanup
```

---

## 6. Garbage Collection

Memory is limited, so the engine must reclaim memory that the program no longer uses.

A simplified **Mark-and-Sweep** process works in two stages:

1. **Mark:** start from accessible references and mark every reachable object.
2. **Sweep:** reclaim memory occupied by objects that were not marked.

Example:

```javascript
let user = { name: "Alex" };

user = null;
```

Initially, `user` refers to the object. Assigning `null` removes that reference. If no other reachable reference points to the object, it becomes eligible for garbage collection.

> Setting a variable to `null` does not immediately destroy an object. The garbage collector decides when its memory is reclaimed.

---

## 7. V8 Architecture

V8 is the JavaScript engine used by Chrome and Node.js. A simplified model highlights three major components:

- **Ignition:** bytecode interpreter
- **TurboFan:** optimizing compiler
- **Orinoco:** garbage-collection system

### Ignition

Ignition converts the parsed representation into bytecode and begins executing it. This allows V8 to start quickly without waiting for all code to become optimized machine code.

### TurboFan

TurboFan uses runtime information to optimize frequently executed code and produce optimized machine code.

### Orinoco

Orinoco is associated with V8's garbage-collection system. It manages memory by reclaiming space that is no longer needed.

### Simplified V8 execution flow

```text
JavaScript Source Code
         ↓
       Parser
         ↓
  Abstract Syntax Tree
         ↓
      Ignition
  (Bytecode Interpreter)
         ↓
    Code Execution
         ↓
 Runtime Information
         ↓
      TurboFan
 (Optimizing Compiler)
         ↓
 Optimized Machine Code
```

Garbage collection operates alongside execution as part of V8's memory-management system.

---

## 8. Engine, Runtime, and Specification

These terms describe different layers:

```text
ECMAScript specification
        ↓
defines language rules

JavaScript engine
        ↓
implements the rules and executes JavaScript

Runtime environment
        ↓
adds environment-specific APIs and scheduling systems
```

For example, V8 can execute JavaScript in both Chrome and Node.js, but Chrome and Node.js provide different APIs around the engine.

---

## 9. Quick Revision Table

| Term | Meaning |
|---|---|
| JavaScript Runtime Environment | Engine plus the APIs and scheduling systems needed to run JavaScript |
| JavaScript Engine | Software that parses, compiles, and executes JavaScript |
| ECMAScript | Specification defining JavaScript language rules |
| Parsing | Converting source code into a structured representation |
| AST | Tree-like representation of program structure |
| JIT compilation | Runtime combination of interpretation and optimization |
| Call Stack | Tracks execution contexts and execution order |
| Memory Heap | Stores dynamically allocated data |
| Garbage Collector | Reclaims unreachable objects |
| Ignition | V8's bytecode interpreter |
| TurboFan | V8's optimizing compiler |
| Orinoco | V8's garbage-collection system |

---

## 10. Interview Questions

### What is a JavaScript engine?

A JavaScript engine is software that parses, compiles, and executes JavaScript according to the ECMAScript specification.

### Is JavaScript interpreted or compiled?

Modern engines use both interpretation and compilation. They can start with bytecode execution and compile frequently used code into optimized machine code at runtime.

### What is JIT compilation?

Just-In-Time compilation is the process of optimizing code while the program is running, often by compiling frequently executed code into machine code.

### What is the difference between a runtime and an engine?

The engine executes JavaScript. The runtime includes the engine plus environment-specific APIs, queues, and scheduling mechanisms.

### What does the Call Stack do?

It tracks active execution contexts and manages their execution order using LIFO behavior.

### What does the garbage collector do?

It identifies objects that are no longer reachable and reclaims the memory they occupy.

### What are Ignition and TurboFan?

Ignition is V8's bytecode interpreter. TurboFan is V8's optimizing compiler.

### What is Orinoco?

Orinoco is associated with V8's garbage-collection system.

---

## 11. Final Mental Model

```text
                 JavaScript Runtime
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  Language rules      Engine           Runtime APIs
  ECMAScript       parse/execute       browser/Node.js
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Ignition    TurboFan    Orinoco
          bytecode   optimized     garbage
         interpreter  compiler    collection
```

### Core takeaway

> JavaScript execution involves more than running source code line by line. The runtime provides environment-specific capabilities, the engine parses and executes the code, JIT compilation improves performance through runtime optimization, and garbage collection manages memory by reclaiming unreachable objects.
