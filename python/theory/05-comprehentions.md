# Python Comprehensions

List, dictionary, and set comprehensions provide concise ways to build collections from iterables. They can transform items, filter them, or do both.

## 1. What is a comprehension?

Without a comprehension:

```python
squares = []

for number in range(5):
    squares.append(number * number)

print(squares)
```

Output:

```text
[0, 1, 4, 9, 16]
```

The same operation with a list comprehension:

```python
squares = [number * number for number in range(5)]
print(squares)
```

A comprehension usually combines an expression, an iterable, and an optional filter:

```text
[expression for item in iterable if condition]
```

- `expression` determines what goes into the result.
- `iterable` provides the input items.
- `condition` optionally filters items.

---

## 2. List comprehensions

### Transforming items

Syntax:

```python
[expression for item in iterable]
```

Example:

```python
numbers = [1, 2, 3, 4]
doubles = [number * 2 for number in numbers]

print(doubles)
```

Output:

```text
[2, 4, 6, 8]
```

The expression is evaluated for each item, and the results form a new list.

### Filtering items

Syntax:

```python
[expression for item in iterable if condition]
```

Example:

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [number for number in numbers if number % 2 == 0]

print(evens)
```

Output:

```text
[2, 4, 6]
```

The `if` at the end filters items; it does not choose an alternative output value.

```python
names = ["Asha", "Ravi", "Ananya", "Mina"]
long_names = [name for name in names if len(name) > 4]

print(long_names)
```

Output:

```text
['Ananya']
```

### Transforming with an if-else expression

If every input should produce one of two possible values, put the conditional expression before the `for`:

```python
[value_if_true if condition else value_if_false for item in iterable]
```

Example:

```python
numbers = [1, 2, 3, 4, 5]
labels = ["even" if number % 2 == 0 else "odd" for number in numbers]

print(labels)
```

Output:

```text
['odd', 'even', 'odd', 'even', 'odd']
```

Compare the two forms:

```python
# Filter: omit odd numbers
[number for number in numbers if number % 2 == 0]

# Transform: keep every number but label it
["even" if number % 2 == 0 else "odd" for number in numbers]
```

Remember:

- A filtering `if` comes after the iterable and removes items.
- An `if...else` expression comes before the `for` and chooses an output value for every item.

---

## 3. Dictionary comprehensions

Dictionary comprehensions create key-value mappings.

Syntax:

```python
{key_expression: value_expression for item in iterable}
```

Example:

```python
squares = {number: number * number for number in range(1, 5)}
print(squares)
```

Output:

```text
{1: 1, 2: 4, 3: 9, 4: 16}
```

Filtering is also supported:

```python
scores = {"Asha": 88, "Ravi": 56, "Mina": 91}
passed = {
    name: score
    for name, score in scores.items()
    if score >= 60
}

print(passed)
```

Output:

```text
{'Asha': 88, 'Mina': 91}
```

### Backend-style example

Create a lookup of active users by ID:

```python
users = [
    {"id": 101, "active": True},
    {"id": 102, "active": False},
    {"id": 103, "active": True},
]

active_users = {
    user["id"]: user
    for user in users
    if user["active"]
}

print(list(active_users))
```

Output:

```text
[101, 103]
```

Dictionary keys are unique. If multiple generated entries use the same key, the later value overwrites the earlier value.

---

## 4. Set comprehensions

Set comprehensions create sets of unique results.

Syntax:

```python
{expression for item in iterable}
```

Example:

```python
words = ["cat", "dog", "apple", "bat"]
lengths = {len(word) for word in words}

print(lengths)
```

Possible output:

```text
{3, 5}
```

Set display order may vary.

Another example:

```python
numbers = [1, 2, 2, 3, 4, 4, 6]
evens = {number for number in numbers if number % 2 == 0}

print(evens)
```

Possible output:

```text
{2, 4, 6}
```

Use a set comprehension when duplicates should be removed and sequence order is not required.

---

## 5. Nested comprehensions

A comprehension can contain more than one `for` clause:

```python
pairs = [(x, y) for x in range(2) for y in range(3)]
print(pairs)
```

Output:

```text
[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]
```

This is equivalent in iteration order to:

```python
pairs = []

for x in range(2):
    for y in range(3):
        pairs.append((x, y))
```

The leftmost `for` is the outer loop; later `for` clauses are nested inside it.

Prefer ordinary loops when a comprehension becomes difficult to read, contains several conditions, or has complicated logic.

---

## 6. Common patterns

### Convert strings to integers

```python
values = ["10", "20", "30"]
numbers = [int(value) for value in values]

print(numbers)  # [10, 20, 30]
```

### Strip whitespace from strings

```python
names = [" Asha ", " Ravi", "Mina "]
clean_names = [name.strip() for name in names]

print(clean_names)  # ['Asha', 'Ravi', 'Mina']
```

### Build a frequency dictionary

```python
words = ["python", "ai", "python", "backend"]
frequency = {word: words.count(word) for word in set(words)}

print(frequency)
```

This repeatedly scans the list and can be inefficient for large inputs. A loop or `collections.Counter` is often better for frequency counting.

### Keep non-empty strings

```python
values = ["hello", "", "python", ""]
non_empty = [value for value in values if value]

print(non_empty)  # ['hello', 'python']
```

This removes falsy strings. To remove only empty strings explicitly, use `if value != ""`.

---

## 7. Comprehensions vs. generator expressions

A list comprehension creates a list immediately:

```python
squares = [n * n for n in range(5)]
```

A generator expression produces values lazily as they are requested:

```python
squares = (n * n for n in range(5))

print(next(squares))  # 0
print(next(squares))  # 1
```

Use a generator expression when values should be processed one at a time without storing all results in a list.

Python has no tuple-comprehension syntax. `(expression for ...)` is a generator expression, not a tuple comprehension.

---

## 8. Common mistakes

### Confusing filtering and transformation

```python
numbers = [1, 2, 3, 4]

# Filters the list: only even numbers remain
[number for number in numbers if number % 2 == 0]

# Transforms every item into True or False
[number % 2 == 0 for number in numbers]
```

Results:

```text
[2, 4]
[False, True, False, True]
```

### Placing the conditional expression incorrectly

Correct:

```python
["even" if n % 2 == 0 else "odd" for n in numbers]
```

An `if...else` conditional expression goes before `for`; a filtering `if` goes after the iterable.

### Expecting set order

```python
values = {n for n in [3, 1, 2, 3]}
```

The values are unique, but their displayed order is not guaranteed. Use `sorted(values)` when sorted output is required.

### Generating duplicate dictionary keys

```python
values = ["cat", "dog", "fox"]
by_length = {len(word): word for word in values}

print(by_length)
```

All three words have length `3`, so the later values overwrite the earlier ones. The final dictionary is:

```text
{3: 'fox'}
```

### Making a comprehension too complex

Avoid packing complicated conditions, nested loops, and transformations into one line. A regular loop is often clearer and easier to debug.

---

## 9. Quick comparison

| Type | Syntax | Result | Typical use |
|---|---|---|---|
| List comprehension | `[expr for x in items]` | List | Transform or filter ordered data |
| Dictionary comprehension | `{k: v for x in items}` | Dictionary | Build a lookup or mapping |
| Set comprehension | `{expr for x in items}` | Set | Create unique transformed values |
| Generator expression | `(expr for x in items)` | Generator | Lazy, one-at-a-time processing |

Filtering form:

```python
[expr for x in items if condition]
```

Conditional transformation form:

```python
[a if condition else b for x in items]
```

---

## Interview questions

### What is a comprehension?

A concise syntax for building a collection by iterating over an iterable and optionally filtering its items.

### How does filtering differ from an if-else expression?

A filtering `if` excludes items that do not match. An `if...else` expression chooses which value to produce for every item.

### What is the difference between list and set comprehensions?

A list comprehension preserves iteration order and allows duplicates. A set comprehension keeps unique hashable results and does not guarantee sequence order.

### What happens when a dictionary comprehension produces duplicate keys?

The later value overwrites the earlier value for that key.

### When should you avoid a comprehension?

Avoid one when the logic is complex, deeply nested, has side effects, or is easier to understand as a normal loop.

### What is the difference between a list comprehension and a generator expression?

A list comprehension builds the list immediately. A generator expression yields values lazily as they are consumed.

---

## Knowledge check

1. What is the output?

   ```python
   [n * 2 for n in range(4) if n % 2 == 0]
   ```

2. What is the output?

   ```python
   ["yes" if n > 2 else "no" for n in [1, 3, 4]]
   ```

3. What is the type of this expression?

   ```python
   (n * n for n in range(3))
   ```

4. What is the final value of `result`?

   ```python
   result = {len(word): word for word in ["ant", "bee", "cat"]}
   ```

5. Which comprehension removes duplicates from `[1, 1, 2, 3, 3]`?

---

## Coding exercises

### Exercise 1: List comprehension

Given `numbers = [2, 5, 8, 11, 14]`, create a new list containing the square of every number.

### Exercise 2: Filter even numbers

Given `numbers = [3, 6, 9, 12, 15, 18]`, create a list containing only numbers divisible by `3` and even.

### Exercise 3: Conditional transformation

Given `numbers = [1, 2, 3, 4, 5]`, create a list where even numbers stay unchanged and odd numbers become `-1`.

### Exercise 4: Dictionary comprehension

Given `words = ["python", "backend", "ai"]`, create a dictionary mapping each word to its length.

### Exercise 5: Set comprehension

Given `words = ["cat", "dog", "apple", "bat", "pear"]`, create a set of unique word lengths.

### Exercise 6: Backend-style filtering

Given:

```python
users = [
    {"id": 1, "active": True},
    {"id": 2, "active": False},
    {"id": 3, "active": True},
]
```

Use a dictionary comprehension to map each active user's ID to the user's full dictionary.

### Exercise 7: Nested comprehension

Create a list of all pairs `(x, y)` where `x` is in `range(2)` and `y` is in `range(2)`.
