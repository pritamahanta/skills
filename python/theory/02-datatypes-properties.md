# Python Data Types and Their Properties

## 1. What are data types?

A **data type** identifies the kind of value a variable currently refers to.

```python
a = 10
p = "Python"

print(type(a))
print(type(p))
```

Output:

```text
<class 'int'>
<class 'str'>
```

- `int` represents an integer.
- `str` represents a string.
- `type()` is a built-in function that identifies the type of a value.

Python determines the type from the assigned value, so a variable's type does not need to be declared separately.

---

## 2. Built-in data types in Python

Python provides several built-in data types:

| Category | Data types |
|---|---|
| Text | `str` |
| Numeric | `int`, `float`, `complex` |
| Sequence | `list`, `tuple`, `range` |
| Mapping | `dict` |
| Set | `set` |
| Boolean | `bool` |
| Binary | Binary data types |
| None type | `NoneType` |

The commonly used types can be studied individually in more detail.

---

## 3. Important properties of Python data types

Three important properties are:

1. Python is dynamically typed.
2. Object size is managed dynamically.
3. Python integers are unbounded.

### 3.1 Dynamic typing

The same variable name can be reassigned to values of different types:

```python
a = 10
print(type(a))

a = "Python"
print(type(a))
```

Output:

```text
<class 'int'>
<class 'str'>
```

Initially, `a` refers to an integer. After reassignment, it refers to a string.

Python does not require a variable's type to be declared in advance. The type associated with a variable can change when the variable is reassigned.

### 3.2 Dynamically managed size

Python manages the memory required to represent an object according to its value. The `sys.getsizeof()` function reports an object's size in bytes.

```python
import sys

c = 500

print(sys.getsizeof(c))
```

When an integer becomes sufficiently large, its reported size can increase:

```python
import sys

c = 500
print(sys.getsizeof(c))

c = c * 1_000_000_000
print(sys.getsizeof(c))
```

On a typical 64-bit CPython installation, the output may be:

```text
28
32
```

The exact values depend on the Python implementation and environment. If the value becomes smaller again, the reported size can also decrease.

Python therefore manages the storage required for integers instead of restricting every integer to one fixed size.

### 3.3 Unbounded integers

Python integers are described as **unbounded** because they are not restricted to a fixed-width integer range:

```python
a = 123456789012345678901234567890
print(a)
```

Python can represent integers with many digits without requiring a larger fixed-width integer type. Larger values may require more storage.

Python's integers are therefore not limited to a fixed minimum and maximum range imposed by a fixed-width representation.

---

## Quick revision

| Property | Meaning |
|---|---|
| Dynamic typing | A variable name can be reassigned to values of different types. |
| Dynamic size management | The memory required for an object can change as its value changes. |
| Unbounded integers | Integers are not restricted to a fixed-width numerical range. |

Important functions:

- `type(value)` identifies the type of a value.
- `sys.getsizeof(value)` reports an object's size in bytes.

## Core takeaway

Python determines types from assigned values, manages object storage dynamically, and supports integers beyond a fixed-width numerical range. These properties distinguish Python's data model from the fixed-size variable model used in some other languages.
