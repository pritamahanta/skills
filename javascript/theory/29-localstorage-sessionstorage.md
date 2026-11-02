# JavaScript: `localStorage` and `sessionStorage`

## 1. What is Web Storage?

Web Storage is a browser feature for storing data on the user's device as key-value pairs.

JavaScript provides two main storage areas:

1. **`localStorage`**: persists across page reloads and browser sessions.
2. **`sessionStorage`**: lasts for a particular tab's browsing session.

Neither storage area is automatically sent to a server with HTTP requests.

### Why use browser storage?

For example, a website can save a user's dark-mode preference. When the page loads again, the application reads the saved value and reapplies the preference instead of making the user select it again.

---

## 2. `localStorage`

`localStorage` stores data that normally remains available across page reloads and browser restarts.

The data remains until the application or user removes it, or the browser clears it.

```js
localStorage.setItem("username", "Pritam");

const username = localStorage.getItem("username");

console.log(username);
// Pritam
```

### Storage scope

Storage is associated with a website's **origin**, which consists of:

- protocol, such as `http` or `https`;
- host, such as a domain;
- port.

These are different origins:

```text
https://example.com
http://example.com
https://example.com:8080
```

A website can access storage belonging to its own origin, not an unrelated origin.

---

## 3. `sessionStorage`

`sessionStorage` stores data for a particular tab's browsing session.

Its data normally:

- survives page refreshes;
- survives navigation within the same tab while the origin remains the same;
- remains separate from session storage in other tabs;
- is cleared when the tab or its browsing context is closed.

```js
sessionStorage.setItem("username", "Pritam");

const username = sessionStorage.getItem("username");

console.log(username);
// Pritam
```

### Storage is separate between tabs

In Tab 1:

```js
sessionStorage.setItem("user", "Pritam");
```

In another tab:

```js
console.log(sessionStorage.getItem("user"));
// null
```

The tabs have separate session-storage areas even when they visit the same website.

---

## 4. `localStorage` vs. `sessionStorage`

| Feature | `localStorage` | `sessionStorage` |
|---|---|---|
| Lifetime | Persists across browser sessions | Duration of a tab's browsing session |
| Page refresh | Data remains | Data remains |
| Browser restart | Normally remains | Does not normally remain after the session ends |
| Multiple tabs | Shared by same-origin tabs | Separate for each tab |
| Scope | Origin | Origin plus top-level browsing context |
| API methods | Same `Storage` interface | Same `Storage` interface |

Use `localStorage` for data that should remain across visits, such as theme, language, and other non-sensitive preferences.

Use `sessionStorage` for temporary tab-specific state, such as multi-step form progress, temporary filters, or a tab's workflow data.

---

## 5. Storage methods

Both APIs use the same methods. Replace `storage` below with either `localStorage` or `sessionStorage`.

### `setItem()`

Stores a key-value pair:

```js
storage.setItem(key, value);

localStorage.setItem("name", "Pritam");
localStorage.setItem("age", "22");
```

### `getItem()`

Retrieves a value by key:

```js
const name = localStorage.getItem("name");
console.log(name);
// Pritam
```

If the key does not exist, `getItem()` returns `null`:

```js
console.log(localStorage.getItem("email"));
// null
```

### `removeItem()`

Removes one key-value pair:

```js
localStorage.removeItem("name");
```

Other keys remain unchanged.

### `clear()`

Removes all key-value pairs from the current storage area:

```js
localStorage.clear();
sessionStorage.clear();
```

Calling `localStorage.clear()` does not clear `sessionStorage`.

### `key()`

Returns the key at a specified index:

```js
localStorage.setItem("name", "Pritam");
localStorage.setItem("age", "22");

console.log(localStorage.key(0));
```

Do not rely on a particular ordering of keys.

### `length`

Returns the number of stored key-value pairs:

```js
console.log(localStorage.length);
```

### Complete example

```js
localStorage.setItem("name", "Pritam");
localStorage.setItem("age", "22");

console.log(localStorage.getItem("name"));
console.log(localStorage.length);

localStorage.removeItem("age");
console.log(localStorage.length);

localStorage.clear();
console.log(localStorage.length);
```

Output:

```text
Pritam
2
1
0
```

Prefer these methods over accessing storage keys as object properties, such as `localStorage.name`.

---

## 6. Web Storage stores strings only

Storage keys and values are strings.

```js
localStorage.setItem("age", 22);

const age = localStorage.getItem("age");

console.log(age);
console.log(typeof age);
```

Output:

```text
22
string
```

Convert the value when a number is needed:

```js
const age = Number(localStorage.getItem("age"));

console.log(age);
console.log(typeof age);
```

Output:

```text
22
number
```

### Storing objects

Objects are converted to strings if stored directly:

```js
const user = {
  name: "Pritam",
  age: 22
};

localStorage.setItem("user", user);
console.log(localStorage.getItem("user"));
// [object Object]
```

Use JSON serialization instead:

```js
const user = {
  name: "Pritam",
  age: 22,
  city: "Jalpaiguri"
};

localStorage.setItem("user", JSON.stringify(user));

const storedUser = localStorage.getItem("user");
const parsedUser = JSON.parse(storedUser);

console.log(parsedUser);
console.log(parsedUser.name);
```

`JSON.stringify()` converts the object to a string, and `JSON.parse()` converts the string back into an object.

### Safer JSON retrieval

A key may be missing, or its stored value may not be valid JSON. `JSON.parse()` throws for invalid JSON:

```js
const storedUser = localStorage.getItem("user");
let user = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Invalid stored user data");
}
```

---

## 7. Example: remembering dark mode

### HTML

```html
<button id="themeBtn">Toggle Theme</button>
```

### JavaScript

```js
const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const currentTheme =
    document.body.classList.contains("dark")
      ? "dark"
      : "light";

  localStorage.setItem("theme", currentTheme);
});
```

The flow is:

1. Read the saved theme when the page loads.
2. Apply the `dark` class when the saved value is `"dark"`.
3. Toggle the theme when the button is clicked.
4. Save the updated preference in `localStorage`.

---

## 8. The `storage` event

The `storage` event allows other documents sharing a storage area to detect changes. It is useful for synchronizing data across same-origin documents.

```js
window.addEventListener("storage", (event) => {
  console.log("Key:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
});
```

When another same-origin tab runs:

```js
localStorage.setItem("theme", "dark");
```

The event can provide:

- `event.key`: the changed key;
- `event.oldValue`: the previous value;
- `event.newValue`: the new value;
- `event.storageArea`: the storage object that changed;
- `event.url`: the URL of the document that made the change.

The event does not fire in the document that performed the change.

For `localStorage`, it can fire in other same-origin tabs. For `sessionStorage`, it is limited to other same-origin documents within the same top-level browsing context, such as iframes in the same tab; it does not synchronize separate tabs.

---

## 9. Limitations and security considerations

### Storage is synchronous

Reading, writing, and deleting Web Storage data are synchronous operations. They block JavaScript execution while they complete, so avoid using Web Storage for very large amounts of data.

### Storage capacity is limited

Browsers impose storage quotas. If a quota is exceeded, `setItem()` can throw a `QuotaExceededError`.

```js
try {
  localStorage.setItem("username", "Pritam");
} catch (error) {
  console.error("Could not save data:", error);
}
```

### Do not store sensitive information

Avoid storing:

- passwords;
- authentication tokens;
- refresh tokens;
- session identifiers;
- sensitive personal information.

JavaScript running on the same origin can access Web Storage. An XSS vulnerability could allow malicious code to read or modify it, so browser storage is not a secure credential store.

### Validate stored data

Users and scripts can modify browser storage. Validate retrieved values before using them, especially when they affect application behavior.

### Storage is not sent automatically

Unlike cookies, `localStorage` and `sessionStorage` values are not automatically attached to HTTP requests. The application must explicitly read and send them when needed.

---

## 10. Web Storage vs. cookies

| Feature | `localStorage` | `sessionStorage` | Cookies |
|---|---|---|---|
| Location | Browser | Browser | Browser |
| Lifetime | Persistent until removed or cleared | Browsing session | Configurable expiration |
| JavaScript access | Yes | Yes | Depends on `HttpOnly` |
| Automatically sent with HTTP requests | No | No | Yes, when applicable |
| Scope | Origin | Origin plus tab session | Domain, path, and cookie rules |
| Typical use | User preferences | Temporary tab-specific state | Server-managed sessions and HTTP state |

Cookies support attributes such as `HttpOnly`, `Secure`, and `SameSite`. Web Storage does not provide equivalent per-item protections.

---

## Interview practice

### What is the difference between `localStorage` and `sessionStorage`?

`localStorage` persists across browser sessions, while `sessionStorage` is associated with a particular tab's browsing session.

### Does `sessionStorage` survive a page refresh?

Yes. It normally remains available after a refresh or navigation within the same tab.

### Can two tabs share `localStorage`?

Yes. Same-origin tabs share the same `localStorage` area.

### Can two tabs share `sessionStorage`?

Normally, no. Each tab has its own session-storage area.

### What does `getItem()` return for a missing key?

It returns `null`.

### Can JavaScript objects be stored directly?

Web Storage stores strings. Use `JSON.stringify()` to serialize an object and `JSON.parse()` to restore it.

### Does the `storage` event fire in the document that changes storage?

No. It fires in other documents that share the relevant storage area.

### Is `localStorage` safe for JWTs?

No. JavaScript can access it, so an XSS vulnerability could expose stored tokens. Do not treat it as a secure credential store.

### Are `localStorage` and `sessionStorage` asynchronous?

No. Their operations are synchronous.

---

## References

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [MDN: `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: `sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [MDN: Storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [OWASP: HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
