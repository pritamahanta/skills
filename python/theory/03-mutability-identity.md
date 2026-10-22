# Python Mutability, Identity, and Equality

Understanding mutability, references, and comparison helps explain how Python objects behave when they are assigned, changed, or compared.

## 1. Mutable vs. immutable objects

A **mutable object** can have its contents changed after creation.

An **immutable object** cannot have its contents changed after creation.

### Common mutable types

- `list`
- `dict`
- `set`
- `bytearray`

### Common immutable types

- `int`
- `float`
- `bool`
- `str`
- `tuple` (the tuple structure is immutable)
- `bytes`
- `frozenset`
- `NoneType` (the type of `None`)

### Examples

A list can be changed in place:

```python
numbers = [1, 2]
numbers.append(3)
print(numbers)  # [1, 2, 3]
```

A string cannot be changed in place:

```python
text = "cat"
# text[0] = "b"  # TypeError

text = "b" + text[1:]
print(text)       # bat
```

The last example creates a new string and reassigns `text`.

> Reassigning a variable is not the same as mutating an object.

```python
x = 10
x = 20  # x now refers to 20; the integer 10 was not changed
```

---

## 2. Variables refer to objects

Assignment does not automatically copy a mutable object:

```python
a = [1, 2]
b = a

b.append(3)

print(a)  # [1, 2, 3]
print(b)  # [1, 2, 3]
```

Both names refer to the same list.

### Making a shallow copy

```python
a = [1, 2]
b = a.copy()

b.append(3)

print(a)  # [1, 2]
print(b)  # [1, 2, 3]
```

A shallow copy creates a new outer container but does not recursively copy nested objects.

---

## 3. A tuple can contain a mutable object

A tuple's item references cannot be replaced, but an object stored inside the tuple may itself be mutable.

```python
items = ([1, 2], "hello")

items[0].append(3)
print(items)  # ([1, 2, 3], 'hello')

# items[0] = [9]  # TypeError: cannot replace a tuple element
```

The list inside the tuple changed. The tuple itself did not become mutable; its structure and item references remain fixed.

---

## 4. `==` vs. `is`

- `==` checks whether two objects compare equal in value.
- `is` checks whether two references point to the exact same object.

```python
a = [1, 2]
b = [1, 2]
c = a

print(a == b)  # True: equal contents
print(a is b)  # False: different list objects
print(a is c)  # True: same object
```

For ordinary value comparison, use `==`:

```python
x = 10
y = 10

print(x == y)  # True
```

Do not use `is` to compare ordinary numbers or strings by value. Python may reuse some immutable objects internally, so identity results can depend on implementation details and context.

---

## 5. The important exception: `None`

Use `is None` to check specifically whether a value is `None`:

```python
result = None

if result is None:
    print("No result")
```

Prefer `is None` and `is not None` over `== None` and `!= None`.

Falsy values are not necessarily `None`:

```python
value = 0

print(bool(value))     # False
print(value is None)   # False
```

An empty string, empty list, zero, and `False` are also falsy, but they are not `None`.

---

## 6. Practical backend example

```python
payload = {"email": "", "user_id": None}

if payload.get("email") == "":
    print("Email is empty")

if payload.get("user_id") is None:
    print("User ID is absent or explicitly None")
```

`get()` returns `None` both when a key is absent and when its value is explicitly `None`. To distinguish those cases, check whether the key exists:

```python
if "user_id" not in payload:
    print("User ID key is missing")
```

---

## 7. Hashability: an interview note

Dictionary keys and set elements must be hashable.

- `int` and `str` are hashable.
- A tuple is hashable only when all its elements are hashable.
- `list`, `dict`, and `set` are not hashable and cannot be dictionary keys or set elements.

```python
valid = {(1, 2), (3, 4)}

# invalid = {[1, 2], [3, 4]}  # TypeError: lists are unhashable
```

---

## Quick revision

- **Mutable:** The object's contents can change in place.
- **Immutable:** The object's contents cannot change in place.
- `b = a` assigns another reference; it does not copy the object.
- `a.copy()` makes a shallow copy for lists and dictionaries.
- `==` compares values according to equality rules.
- `is` checks object identity.
- Use `is None` to test specifically for `None`.
- Do not rely on `is` for numbers or strings.
- A tuple can contain mutable objects while its own structure remains immutable.

---

## Knowledge check

Try to answer these before running the code.

1. What is printed?

   ```python
   a = [1, 2]
   b = a
   b.append(3)
   print(a)
   ```

2. What is printed?

   ```python
   a = [1, 2]
   b = [1, 2]
   print(a == b, a is b)
   ```

3. Which is the recommended check for `None`?

   - `x == None`
   - `x is None`
   - `bool(x) == False`

4. What happens here?

   ```python
   text = "python"
   text[0] = "P"
   ```

5. What is printed?

   ```python
   items = ([1, 2],)
   items[0].append(3)
   print(items)
   ```

6. Why should `is` not be used to compare two strings by their content?

---

## Coding exercises

### Exercise 1: Aliasing

Create `a = [10, 20]`, assign `b = a`, append `30` using `b`, and explain why `a` changed too.

### Exercise 2: Copying

Repeat Exercise 1, but make a shallow copy so that appending to `b` does not change `a`.

### Exercise 3: Equality vs. identity

Create two separate lists with the same values. Print the results of `==` and `is`, and explain each result.

### Exercise 4: `None` vs. falsy

Given `value = 0`, write one condition that checks whether it is `None` and another that checks whether it is falsy. The conditions should not be treated as equivalent.

### Exercise 5: Nested mutability

Given `data = ([1, 2], "x")`, append `3` to the list inside the tuple. Then explain why replacing the tuple's first element is not allowed.
