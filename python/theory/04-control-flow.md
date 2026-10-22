# Python Control Flow

Conditionals, loops, `range()`, `enumerate()`, and `zip()` help control how Python code executes and how collections are processed.

## 1. Conditionals: `if`, `elif`, and `else`

Conditionals choose which code to execute based on a condition.

```python
score = 76

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("Needs improvement")
```

Output:

```text
C
```

Python checks conditions from top to bottom. Once a condition is true, its block runs and the remaining branches are skipped.

Important rules:

- `if` starts a conditional chain.
- `elif` adds another condition.
- `else` runs when no earlier condition is true.
- Indentation defines each block.
- The order of conditions matters when they overlap.

### Condition order matters

```python
score = 95

if score >= 70:
    print("C")
elif score >= 90:
    print("A")
```

Output:

```text
C
```

The first condition matches, so Python never reaches the `elif`. Put the higher threshold first:

```python
if score >= 90:
    print("A")
elif score >= 70:
    print("C")
```

### Logical operators

```python
age = 22
has_valid_id = True

if age >= 18 and has_valid_id:
    print("Entry allowed")
```

- `and`: both operands must be truthy.
- `or`: at least one operand must be truthy.
- `not`: reverses truthiness.

### Backend-style example

```python
user = {"email": "", "is_active": True}

if not user.get("email"):
    print("Email missing or empty")
elif not user["is_active"]:
    print("Account inactive")
else:
    print("User is ready")
```

`not user.get("email")` treats a missing key, `None`, and an empty string as falsy. Use `is None` when you specifically need to check for `None`.

---

## 2. `for` loops

A `for` loop processes items from an iterable, such as a list, tuple, string, dictionary, set, or `range`.

```python
languages = ["Python", "C++", "Java"]

for language in languages:
    print(language)
```

Output:

```text
Python
C++
Java
```

The loop variable receives the next item on each iteration.

### Iterating over a string

```python
for char in "AI":
    print(char)
```

Output:

```text
A
I
```

### Iterating over a dictionary

```python
user = {"name": "Pritam", "age": 22}

for key, value in user.items():
    print(key, value)
```

Use:

- `.items()` for key-value pairs
- `.keys()` for keys
- `.values()` for values

Use a `for` loop when processing each item in a collection or iterating over a known sequence.

---

## 3. `while` loops

A `while` loop repeats while its condition is true.

```python
count = 0

while count < 3:
    print(count)
    count += 1
```

Output:

```text
0
1
2
```

The update to `count` eventually makes `count < 3` false.

### Avoiding infinite loops

```python
count = 0

while count < 3:
    print(count)
    # count is never updated
```

This loop does not terminate because `count` remains `0`.

Use a `while` loop when the number of repetitions depends on a condition or changing state, such as retrying an operation up to a limit.

---

## 4. `break`, `continue`, and `pass`

These statements affect control flow in different ways:

- `break`: exits the nearest enclosing loop.
- `continue`: skips the rest of the current iteration and starts the next one.
- `pass`: does nothing and acts as a placeholder.

### `break`

```python
for number in range(5):
    if number == 3:
        break
    print(number)
```

Output:

```text
0
1
2
```

### `continue`

```python
for number in range(5):
    if number == 2:
        continue
    print(number)
```

Output:

```text
0
1
3
4
```

### `pass`

```python
def process_request():
    pass
```

`pass` keeps an empty function or block syntactically valid. It does not skip an iteration or exit a loop.

---

## 5. `range()`

`range()` represents a sequence of integers and is commonly used to repeat a task a fixed number of times.

```python
range(stop)
range(start, stop)
range(start, stop, step)
```

The `stop` value is excluded.

### Examples

```python
list(range(5))          # [0, 1, 2, 3, 4]
list(range(2, 6))       # [2, 3, 4, 5]
list(range(2, 10, 2))   # [2, 4, 6, 8]
list(range(5, 0, -1))   # [5, 4, 3, 2, 1]
```

The `step` may be positive or negative, but it cannot be zero. A negative step is useful for counting down.

### Common uses

Repeat five times:

```python
for _ in range(5):
    print("Hello")
```

The variable `_` conventionally means that the loop value is not needed.

Print even numbers from 2 through 20:

```python
for number in range(2, 21, 2):
    print(number)
```

`range()` returns a `range` object rather than a list. It represents the sequence without constructing a list of every value upfront. Use `list(range(...))` when a list is specifically required.

---

## 6. `enumerate()`

Use `enumerate()` when you need both the index and the value during iteration.

```python
languages = ["Python", "C++", "Java"]

for index, language in enumerate(languages):
    print(index, language)
```

Output:

```text
0 Python
1 C++
2 Java
```

To start counting from `1`:

```python
for index, language in enumerate(languages, start=1):
    print(index, language)
```

Output:

```text
1 Python
2 C++
3 Java
```

Usually, this is clearer than manual indexing:

```python
for index, language in enumerate(languages):
    print(index, language)
```

`enumerate()` produces an iterator of `(index, value)` pairs and does not change the original collection.

---

## 7. `zip()`

Use `zip()` to iterate over multiple iterables in parallel, taking one item from each on every iteration.

```python
names = ["Asha", "Ravi", "Mina"]
scores = [90, 85, 92]

for name, score in zip(names, scores):
    print(name, score)
```

Output:

```text
Asha 90
Ravi 85
Mina 92
```

### Different-length iterables

By default, `zip()` stops when the shortest iterable is exhausted:

```python
a = [1, 2, 3]
b = ["x", "y"]

print(list(zip(a, b)))
```

Output:

```text
[(1, 'x'), (2, 'y')]
```

The unmatched `3` is ignored.

Python 3.10 and later support `strict=True` when equal lengths are required:

```python
for left, right in zip(a, b, strict=True):
    print(left, right)
```

This raises `ValueError` when the iterables have different lengths.

### Building a lookup dictionary

```python
user_ids = [101, 102, 103]
usernames = ["asha", "ravi", "mina"]

user_lookup = dict(zip(user_ids, usernames))
print(user_lookup)
```

Output:

```text
{101: 'asha', 102: 'ravi', 103: 'mina'}
```

If keys repeat, later values overwrite earlier values when the pairs are converted into a dictionary.

`zip()` returns an iterator. Use `list(zip(...))` when all pairs need to be stored in a list.

---

## 8. Choosing the right tool

| Need | Tool |
|---|---|
| Make a decision | `if` / `elif` / `else` |
| Process each item | `for` |
| Repeat while a condition is true | `while` |
| Generate a fixed integer sequence | `range()` |
| Get an index and its value | `enumerate()` |
| Process multiple iterables together | `zip()` |
| Exit a loop | `break` |
| Skip the current iteration | `continue` |
| Use a do-nothing placeholder | `pass` |

---

## 9. Common mistakes

1. Forgetting that `range()` excludes its stop value.
2. Forgetting to update state in a `while` loop, causing an infinite loop.
3. Placing a broad condition before a more specific condition in an `if`/`elif` chain.
4. Using `range(len(items))` when direct iteration or `enumerate()` is clearer.
5. Assuming `zip()` includes unmatched items. By default, it stops at the shortest iterable.
6. Confusing `pass`, `break`, and `continue`.
7. Modifying a list while iterating over it, which can cause skipped items or unexpected behavior. When filtering, build a new list or iterate over a copy.

---

## 10. Interview questions

### What is the difference between `for` and `while`?

A `for` loop iterates over items from an iterable. A `while` loop repeats as long as a condition is true.

### Why is the stop value in `range()` excluded?

`range(start, stop)` generates values from `start` up to, but not including, `stop`. This makes the number of values straightforward to calculate and aligns with Python slicing conventions.

### What does `enumerate()` solve?

It provides both the current index and item without requiring manual index management.

### What happens when `zip()` inputs have different lengths?

By default, iteration stops when the shortest input is exhausted. With `strict=True` in Python 3.10 and later, a length mismatch raises `ValueError`.

### What is the difference between `break` and `continue`?

`break` exits the nearest enclosing loop. `continue` skips the remaining body of the current iteration and proceeds to the next iteration.

### What can cause an infinite `while` loop?

A loop condition that never becomes false, often because the state used by the condition is never updated.

---

## Practice questions

Try to predict each result before running the code.

### Question 1: `range()`

```python
print(list(range(2, 10, 3)))
```

### Question 2: `continue`

```python
for x in range(5):
    if x == 2:
        continue
    print(x)
```

### Question 3: `enumerate()`

```python
items = ["a", "b"]
print(list(enumerate(items, start=1)))
```

### Question 4: `zip()`

```python
print(list(zip([1, 2, 3, 4], ["a", "b"])))
```

### Question 5: Condition order

```python
score = 95

if score >= 70:
    print("C")
elif score >= 90:
    print("A")
```

---

## Coding exercises

### Exercise 1: Conditional logic

Given `score = 76`, print `"A"` for scores at least 90, `"B"` for scores at least 80, `"C"` for scores at least 70, and `"Needs improvement"` otherwise.

### Exercise 2: `range()`

Print all even numbers from 2 through 20 using `range()`.

### Exercise 3: Loop accumulation

Given `numbers = [4, 7, 2, 9]`, calculate their sum with a loop. Do not use `sum()`.

### Exercise 4: `enumerate()`

Given `tasks = ["build", "test", "deploy"]`, print each task with a one-based number, such as `1 build`.

### Exercise 5: `zip()`

Given `users = ["Asha", "Ravi", "Mina"]` and `ids = [101, 102, 103]`, print each user with the matching ID.

### Exercise 6: Filtering

Given `numbers = [3, 8, 11, 14, 17, 20]`, create a new list containing only the even numbers. Do not modify the original list while iterating.

---

## What to memorize

```text
Conditionals: if / elif / else
Collection iteration: for item in iterable
Condition-based repetition: while condition
Fixed integer sequence: range(start, stop, step)  # stop excluded
Index and value: enumerate(iterable, start=0)
Parallel iteration: zip(iterable1, iterable2)     # shortest by default
Exit loop: break
Skip current iteration: continue
Placeholder: pass
```

## Core takeaway

Use direct iteration by default. Add `range()`, `enumerate()`, or `zip()` when their specific behavior is needed.
