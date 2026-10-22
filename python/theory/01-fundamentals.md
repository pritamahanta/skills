# Python Fundamentals

Variables, numbers, strings, booleans, and `None` form the foundation for Python development.

## 1. Variables

A variable is a name that refers to an object in Python. You do not need to declare its type explicitly.

```python
name = "Pritam"
age = 22
rating = 1552
is_student = True

print(name)
print(type(rating))   # <class 'int'>
```

Important points:

- Python is dynamically typed: a variable name can refer to objects of different types at different times.
- `=` assigns a value; it does not compare values.
- `type(value)` identifies an object's type.
- Variable names are case-sensitive.

```python
x = 10
x = "hello"    # Valid: x now refers to a string

score = 100
Score = 200     # Different name from score
```

### Naming rules

- Names may contain letters, digits, and underscores.
- Names cannot begin with a digit.
- Hyphens cannot be used in variable names.
- Use `snake_case` for ordinary variables.

```python
user_age = 22   # Valid
_private = 10   # Valid
user2 = 5       # Valid
# 2user = 5     # Invalid
# user-age = 5  # Invalid
```

Prefer descriptive names such as `user_id`, `retry_count`, and `embedding_vector`.

---

## 2. Numbers

The main numeric types are:

- `int`: integers such as `42`, `-7`, and `0`
- `float`: decimal or floating-point numbers such as `3.14` and `-0.5`
- `complex`: complex numbers such as `2 + 3j`

### Arithmetic operators

```python
a = 17
b = 5

print(a + b)   # 22       Addition
print(a - b)   # 12       Subtraction
print(a * b)   # 85       Multiplication
print(a / b)   # 3.4      True division
print(a // b)  # 3        Floor division
print(a % b)   # 2        Remainder
print(a ** b)  # 1419857  Exponentiation
```

Important distinctions:

- `/` performs true division and returns a `float`.
- `//` performs floor division and rounds down toward negative infinity.
- `%` returns the remainder and is useful for divisibility and even/odd checks.

```python
print(10 / 2)    # 5.0
print(10 // 3)   # 3
print(-7 // 2)   # -4
print(7 % 2)     # 1
print(10 ** 3)   # 1000
```

### Type conversion

```python
x = int("42")       # 42
y = float("3.14")   # 3.14
z = str(100)        # "100"
```

Be careful with conversions:

```python
int("3.14")   # ValueError: not an integer representation
int(3.99)      # 3: conversion truncates toward zero
```

### Floating-point precision

```python
print(0.1 + 0.2)  # 0.30000000000000004
```

This small difference is normal with binary floating-point numbers. For financial calculations that require decimal accuracy, consider `decimal.Decimal`.

---

## 3. Strings

A string (`str`) represents text. Strings can use single quotes, double quotes, or triple quotes.

```python
language = "Python"
message = 'Hello World'
description = """This is
multiple lines."""
```

### Common operations

```python
text = "backend"

print(len(text))          # 7
print(text[0])            # 'b'
print(text[-1])           # 'd'
print(text[0:4])          # 'back'
print(text.upper())       # 'BACKEND'
print(text.capitalize())  # 'Backend'
print("back" in text)     # True
```

### Indexing and slicing

- Indexing starts at `0`.
- Negative indexes count from the end; `text[-1]` is the last character.
- `text[start:stop]` includes `start` but excludes `stop`.

### Strings are immutable

Characters in an existing string cannot be changed directly:

```python
text = "cat"
# text[0] = "b"  # TypeError

text = "b" + text[1:]
print(text)       # bat
```

The last example creates a new string and assigns it to `text`.

### F-strings

F-strings insert values into strings:

```python
name = "Pritam"
problems_solved = 3000
message = f"{name} solved {problems_solved} problems."
print(message)
```

Numbers can be formatted inside an f-string:

```python
price = 19.9876
print(f"{price:.2f}")  # 19.99
```

Avoid concatenating a string directly with an integer:

```python
age = 22
# print("Age: " + age)  # TypeError
print("Age: " + str(age))
print(f"Age: {age}")     # Often the clearest option
```

---

## 4. Booleans

The `bool` type has two values: `True` and `False`. Capitalization matters.

```python
is_authenticated = True
has_permission = False

print(type(is_authenticated))  # <class 'bool'>
```

### Comparison operators

```python
x = 10

print(x == 10)   # True   Equal to
print(x != 5)    # True   Not equal to
print(x > 5)     # True
print(x < 5)     # False
print(x >= 10)   # True
print(x <= 9)    # False
```

Remember:

```python
x = 10     # Assignment
x == 10    # Comparison
```

### Logical operators

```python
age = 22
has_id = True

print(age >= 18 and has_id)  # True
print(age < 18 or has_id)    # True
print(not has_id)            # False
```

- `and`: both conditions must be truthy for the result to be truthy.
- `or`: at least one operand must be truthy for the result to be truthy.
- `not`: reverses the truth value.
- `and` and `or` short-circuit and can return an operand rather than only `True` or `False`.

### Truthiness

These values are falsy in conditions:

```python
bool(0)        # False
bool(0.0)      # False
bool("")       # False
bool(None)     # False
bool([])       # False
bool({})       # False
```

These values are truthy:

```python
bool(42)       # True
bool("hello")  # True
```

Example:

```python
username = ""

if not username:
    print("Username is missing")
```

Empty strings, lists, and dictionaries are falsy, but they are not `None`.

---

## 5. `None`

`None` is Python's special value representing the absence of a value. Its type is `NoneType`.

```python
result = None

print(result)        # None
print(type(result))  # <class 'NoneType'>
```

Common uses include:

- A function does not explicitly return a value.
- An optional field has no value.
- A database lookup finds no matching record.
- A value has not yet been assigned meaningful data.

```python
def find_user(user_id):
    if user_id == 1:
        return "Pritam"
    return None

user = find_user(99)

if user is None:
    print("User not found")
```

Use `is None` to check for `None`:

```python
value = None

if value is None:
    print("No value")
```

`is` checks object identity. `None` is a singleton, so `value is None` is the standard check.

Do not confuse `None` with other falsy values:

```python
value = 0

print(value == None)  # False
print(value is None)  # False
print(bool(value))    # False
```

A value can be falsy without being `None`.

---

## Quick revision

| Concept | Example or reminder |
|---|---|
| Assignment | `x = 10` |
| Check a type | `type(x)` |
| Floor division | `//`, which rounds down |
| Remainder | `%` |
| String formatting | `f"Hello {name}"` |
| Strings | Immutable |
| Equality comparison | `==` |
| Boolean values | `True` and `False` |
| Missing or absent value | `None` |
| Check for `None` | `value is None` |
| Empty string/list/dict | Falsy, but not `None` |

---

## Practice questions

Try to answer these without running the code first.

### Predict the output or behavior

1. What is the output?

   ```python
   x = 10
   x = "Python"
   print(type(x))
   ```

2. What is the output?

   ```python
   print(17 // 5, 17 % 5)
   ```

3. What is the output?

   ```python
   print(-7 // 2)
   ```

4. What happens here?

   ```python
   text = "Python"
   text[0] = "J"
   ```

5. Which expression correctly checks whether `x` is `None`?

   ```python
   x = None
   ```

   Options: `x == False`, `not x`, `x is None`

6. What is the output?

   ```python
   print(bool([]), bool("0"), bool(0))
   ```

### Coding exercises

#### Exercise 1: Variables and arithmetic

Given `total_seconds = 3672`, calculate the number of hours, remaining minutes, and remaining seconds.

Expected values: `1`, `1`, `12`.

#### Exercise 2: Strings

Given `name = "  pRiTaM mAhAnTa  "`, remove the surrounding whitespace and print the name in title case.

#### Exercise 3: Boolean logic

Given `age = 21` and `has_valid_id = True`, create a Boolean variable `can_enter` that is true only when the person is at least 18 and has a valid ID.

#### Exercise 4: `None` and truthiness

Given `user_email = None`, write a condition that prints `"Email not provided"` only when the value is specifically `None`. Then consider what should happen if the value is an empty string (`""`).

#### Exercise 5: Backend-style validation

Given:

```python
user = {
    "name": "Pritam",
    "email": "",
    "age": 22
}
```

Write checks that determine whether the email is missing or empty. Separately, check an optional age value without incorrectly treating `age = 0` as equivalent to `None`.
