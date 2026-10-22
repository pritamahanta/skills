# Python Collections

Lists, tuples, dictionaries, and sets are Python's core built-in collections. Choosing the right one depends on whether you need ordering, mutability, key-based lookup, uniqueness, or fast membership checks.

## 1. Quick comparison

| Collection | Ordered | Mutable | Duplicates | Access | Best for |
|---|---|---|---|---|---|
| `list` | Yes | Yes | Allowed | Index | An ordered sequence that may change |
| `tuple` | Yes | No | Allowed | Index | A fixed group of values |
| `dict` | Insertion order preserved | Yes | Keys are unique | Key | Looking up values by meaningful keys |
| `set` | Not a sequence order | Yes | Not allowed | No indexing | Unique values, membership checks, and set operations |

Examples:

```python
numbers = [10, 20, 30]
point = (10, 20, 30)
user = {"name": "Pritam", "age": 22}
ids = {10, 20, 30}
empty_set = set()
```

### Rule of thumb

- Use a **list** for an ordered, changeable sequence.
- Use a **tuple** for an ordered, fixed sequence.
- Use a **dictionary** to look up values by key.
- Use a **set** for unique values or fast membership checks.

---

## 2. Lists

Lists are ordered, mutable, allow duplicates, and support indexing and slicing.

```python
numbers = [10, 20, 30, 20]

print(numbers[0])      # 10
print(numbers[-1])     # 20
print(numbers[1:3])    # [20, 30]
print(len(numbers))    # 4
```

### Common operations

```python
numbers.append(40)        # Add one item at the end
numbers.extend([50, 60])  # Add each item from an iterable
numbers.insert(1, 15)     # Insert at index 1
numbers.remove(20)       # Remove the first matching value
last = numbers.pop()      # Remove and return the last item
numbers.sort()            # Sort the same list in place
numbers.reverse()         # Reverse the same list in place
```

Important differences:

- `append([4, 5])` adds one nested list as a single item.
- `extend([4, 5])` adds `4` and `5` as separate items.
- `sort()` changes the list in place and returns `None`.
- `sorted(numbers)` returns a new sorted list.
- `x in numbers` checks membership and usually takes `O(n)` time.

```python
items = [1, 2]
items.append([3, 4])
print(items)  # [1, 2, [3, 4]]

items = [1, 2]
items.extend([3, 4])
print(items)  # [1, 2, 3, 4]
```

### Aliasing and copying

Assigning one list to another variable creates another reference to the same list:

```python
a = [1, 2]
b = a

b.append(3)
print(a)  # [1, 2, 3]
```

To create a shallow copy, use either of these:

```python
b = a.copy()
b = list(a)
```

A shallow copy does not recursively copy nested objects.

---

## 3. Tuples

Tuples are ordered and immutable. They support indexing, slicing, iteration, and duplicate values, but their elements cannot be replaced or appended.

```python
point = (4, 7)
print(point[0])  # 4
```

### Single-element tuple

A single-element tuple requires a trailing comma:

```python
x = (5,)       # tuple
not_tuple = (5)  # int; parentheses alone do not create a tuple
```

### Tuple unpacking

```python
x, y = (4, 7)

print(x)  # 4
print(y)  # 7
```

Tuple unpacking is useful when a function returns multiple values:

```python
def min_max(values):
    return min(values), max(values)

low, high = min_max([5, 2, 9])
```

### Tuples as dictionary keys or set elements

A tuple can be used as a dictionary key or set element only when all its contents are hashable:

```python
valid_key = (1, "user")
invalid_key = (1, [2, 3])  # Not hashable
```

The second tuple contains a list, so it cannot be used as a dictionary key or set element.

---

## 4. Dictionaries

Dictionaries map keys to values. Keys must be hashable, and each key can appear only once.

```python
user = {"name": "Pritam", "age": 22}

print(user["name"])  # Pritam

user["age"] = 23          # Update a key
user["city"] = "Siliguri" # Add a key
```

### Safe access

Use `get()` when a key may be absent:

```python
print(user.get("email"))              # None if absent
print(user.get("email", "not set"))  # Custom default
```

- `user["email"]` raises `KeyError` if the key is absent.
- `"name" in user` checks whether `"name"` is a key, not a value.
- Dictionaries preserve insertion order in modern Python (Python 3.7+ language guarantee).

### Iterating over a dictionary

```python
for key in user:
    print(key)

for value in user.values():
    print(value)

for key, value in user.items():
    print(key, value)
```

### Common methods

- `get(key, default)`: read without raising `KeyError` for a missing key.
- `keys()`: return a view of the keys.
- `values()`: return a view of the values.
- `items()`: return a view of key-value pairs.
- `update(other)`: add or replace entries from another mapping or iterable.
- `pop(key)`: remove a key and return its value; raises `KeyError` if absent unless a default is supplied.

---

## 5. Sets

A set stores unique, hashable elements. It does not support indexing or slicing.

```python
ids = {101, 102, 103, 101}

print(ids)         # Contains 101, 102, 103; display order may vary
print(102 in ids)  # True
```

### Adding and removing elements

```python
ids.add(104)       # Add one element
ids.discard(999)   # No error if absent
ids.remove(103)    # Raises KeyError if absent
```

### Set operations

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # Union: {1, 2, 3, 4, 5}
print(a & b)  # Intersection: {3}
print(a - b)  # Elements in a but not b
print(a ^ b)  # In either set, but not both
```

### Removing duplicates

```python
values = [3, 1, 3, 2, 1]
unique_values = set(values)
```

Converting a list to a set removes duplicates, but the original order is not guaranteed to be preserved.

An empty set must be written as `set()`. `{}` creates an empty dictionary.

### Hashable values

Hashability is important for set elements and dictionary keys.

Commonly hashable values include:

- Integers
- Strings
- Tuples whose elements are all hashable

Lists, dictionaries, and sets are not hashable:

```python
scores = {"alice": 90, "bob": 85}
seen = {10, 20, 30}

# seen = {[1, 2], [3, 4]}  # TypeError: lists cannot be set elements
# data = {[1, 2]: "value"} # TypeError: lists cannot be dictionary keys
```

---

## 6. Performance basics

Typical average-case time complexities for built-in collections are:

| Collection | Operation | Typical average-case complexity |
|---|---|---|
| List | Index access | `O(1)` |
| List | Append at end | `O(1)` amortized |
| List | Membership search | `O(n)` |
| Tuple | Index access | `O(1)` |
| Tuple | Membership search | `O(n)` |
| Dictionary | Key lookup, insertion, deletion | `O(1)` |
| Set | Membership, insertion, removal | `O(1)` |

Dictionary and set operations can have `O(n)` worst cases. Treat `O(1)` as the typical average, not a universal guarantee.

---

## 7. Common mistakes

1. Using `{}` for an empty set. Use `set()`.
2. Expecting sets to preserve a useful sequence order or support indexing.
3. Using `dict[key]` when a key may be absent. Use `get()` or check the key first.
4. Confusing `append()` with `extend()`.
5. Assuming `b = a` copies a list. It creates another reference to the same list.
6. Forgetting the comma in a single-element tuple: `(5,)`.
7. Placing a list, dictionary, or set inside a set, or using one as a dictionary key.
8. Assuming `key in my_dict` searches values. It searches keys.

---

## 8. Choosing a collection

- Store recent API results in order and append new results: use a **list**.
- Store a fixed `(latitude, longitude)` pair: use a **tuple**.
- Find a user record by `user_id`: use a **dictionary**.
- Track processed IDs and avoid duplicates: use a **set**.
- Count occurrences of values: use a **dictionary**. `collections.Counter` is another standard-library option to learn later.
- Check whether a username exists: use a **set** for usernames alone, or a **dictionary** if each username maps to data.

---

## Knowledge check

Try to answer these before looking up the answers.

1. What does this print?

   ```python
   items = [1, 2]
   items.append([3, 4])
   print(len(items))
   ```

2. What is the type of `x`?

   ```python
   x = (5)
   ```

3. Does `"name" in user` check keys or values?

   ```python
   user = {"name": "Pritam", "age": 22}
   ```

4. Which collection is most suitable for fast average-case membership checks among unique user IDs?

5. Why does `set()` create an empty set while `{}` creates an empty dictionary?

6. Will this work as a dictionary key? Why or why not?

   ```python
   key = (1, [2, 3])
   ```

---

## Coding exercises

### Exercise 1: List operations

Given `numbers = [4, 1, 3, 1]`, append `7`, remove the first `1`, sort the list, and print the result.

### Exercise 2: Tuple unpacking

Given `point = (12, 8)`, unpack it into `x` and `y`, then print both values.

### Exercise 3: Dictionary lookup

Given `user = {"name": "Pritam", "age": 22}`, print the user's email if it exists; otherwise print `"Email not provided"`. Do not raise `KeyError`.

### Exercise 4: Deduplication and membership

Given `ids = [10, 20, 10, 30, 20]`, create a set of unique IDs and check whether `30` is present.

### Exercise 5: Backend-style data

Given:

```python
request = {
    "user_id": 42,
    "roles": ["reader", "editor"],
    "is_active": True
}
```

Write code that:

- reads `user_id` safely with a default of `None`;
- checks whether `"editor"` is among the roles;
- checks whether `user_id` is specifically `None`.
