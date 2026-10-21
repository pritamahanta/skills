# Python Predefined Functions, Errors, and Identifiers

## 1. Predefined functions in Python

**Predefined functions** are functions already available for use in Python. They include:

1. **Built-in functions**, which can be called directly.
2. **Functions provided by modules**, which are accessed after importing the relevant module.

### Built-in functions

Two important built-in functions are `print()` and `input()`.

#### The `print()` function

`print()` displays output:

```python
print("Hello Python")
print("Hello", "World")
print("Hello", "Python", "World")
```

When multiple values are passed to `print()`, they are separated by a space by default.

The `end` argument controls what is printed after the output. Its default value is a newline:

```python
print("Hello")
print("Python")
```

Output:

```text
Hello
Python
```

A different `end` value can be supplied:

```python
print("Hello", end=" ")
print("Python")
```

Output:

```text
Hello Python
```

The `sep` argument controls what appears between multiple values. Its default value is also a space:

```python
print("Hello", "Python")
print("Hello", "Python", sep="@")
```

Output:

```text
Hello Python
Hello@Python
```

Remember:

- `end` controls what follows the output.
- `sep` controls what separates multiple values.

#### The `input()` function

`input()` accepts input from the user. The entered value is assigned to a variable:

```python
name = input()
print(name)
```

A prompt can be displayed by passing a string to `input()`:

```python
num = input("Enter a number: ")
print(num)
```

---

## 2. Functions provided by modules

A **module** is a collection of functions and statements that provides additional functionality for Python programs.

Python includes modules such as `math` and `platform`. These modules are available with Python, but they must be imported before their members can be accessed through the module name. Modules can also be provided by third parties.

### Using the `math` module

```python
import math

print(math.sqrt(25))
print(math.factorial(5))
```

Output:

```text
5.0
120
```

- `math.sqrt(25)` calls the square-root function from the `math` module.
- `math.factorial(5)` calls the factorial function from the same module.

Calling `sqrt(25)` directly without importing `sqrt` into the current namespace results in a name-related error.

**Key distinction:**

- Built-in functions such as `print()` can be called directly.
- Module functions such as `math.sqrt()` are accessed through an imported module.

---

## 3. Errors in Python

Errors occur when Python encounters invalid code or cannot complete an operation during execution. Two important categories are syntax errors and runtime errors.

### Syntax errors

A **syntax error** occurs when code violates Python's syntax rules.

Common causes include:

- Missing parentheses.
- Misspelled keywords.
- Incorrect operator or statement syntax.
- Using a reserved keyword where a variable name is expected.

Example:

```python
print("Hello"
```

The missing closing parenthesis makes the statement incomplete and causes a syntax error. Similarly, writing `fall` instead of `for` in a loop produces invalid syntax.

Syntax errors must be fixed before the affected code can execute.

### Runtime errors

A **runtime error**, also called an exception in this context, occurs while the program is executing.

```python
a = 5
b = 0

print(a / b)
print("I am the last line")
```

The division causes a `ZeroDivisionError` because division by zero is not allowed. Therefore, the second `print()` statement is not executed.

If `b` were nonzero, the division would succeed and execution could continue.

### Syntax errors vs. runtime errors

| Syntax error | Runtime error |
|---|---|
| Caused by invalid syntax. | Occurs during execution. |
| Example: a missing closing parenthesis. | Example: dividing by zero. |
| Must be corrected before the affected code can execute. | The program starts executing but fails during an operation. |

---

## 4. Identifiers in Python

An **identifier** is a name given to an entity such as a variable, function, or class.

```python
a = 10
b = 20
```

Here, `a` and `b` are identifiers.

### Identifier naming rules

#### 1. Reserved keywords cannot be used

Python reserves certain words for its syntax. They cannot be used as ordinary identifiers:

```python
raise = 5
```

This causes a syntax error because `raise` is a reserved keyword.

Python is case-sensitive, so a differently capitalized name is a different identifier:

```python
Raise = 5
```

#### 2. An identifier cannot begin with a digit

Invalid:

```python
0abc = 10
1ac = 20
```

Valid:

```python
c1 = 10
c2 = 20
```

Digits may appear after the first character, but not at the beginning.

#### 3. Letters, digits, and underscores are allowed

Valid examples:

```python
first_name = "Mayank"
a5 = 10
_b = 20
_ = 30
```

Characters such as `@`, `-`, `#`, and `$` cannot be used as ordinary identifier characters:

```python
a@5 = 10
first-name = "Mayank"
```

An underscore may also be used by itself as an identifier.

#### 4. Identifiers are case-sensitive

Uppercase and lowercase letters represent different identifiers:

```python
a = 5
A = 10

print(a)
print(A)
```

Output:

```text
5
10
```

Therefore, `a` and `A`, or `ABC` and `abc`, are different names.

#### 5. Reassignment changes the current value

```python
c1 = 10
c1 = 25

print(c1)
```

Output:

```text
25
```

After the second assignment, `c1` refers to `25` instead of `10`. If the earlier value is needed, it must be stored separately.

---

## Quick revision

| Concept | Remember |
|---|---|
| Built-in function | Available directly, such as `print()`. |
| Module function | Accessed through an imported module, such as `math.sqrt()`. |
| `print()` | Displays output. |
| `end` | Controls what follows the output; newline by default. |
| `sep` | Controls the separator between values; space by default. |
| `input()` | Accepts user input. |
| Syntax error | Invalid Python syntax. |
| Runtime error | An error encountered during execution, such as division by zero. |
| Identifier | A name for an entity such as a variable, function, or class. |
| Naming rules | Do not use reserved keywords or begin with a digit; use letters, digits, and underscores. |
| Case sensitivity | `a` and `A` are different identifiers. |
| Reassignment | A new assignment changes the value currently associated with an identifier. |

## Core takeaway

Python provides built-in functions for common tasks and modules for additional functionality. Understanding errors and identifier rules helps you write valid code and identify common mistakes.
