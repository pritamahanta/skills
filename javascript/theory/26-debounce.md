# JavaScript: Debouncing

## 1. What is debouncing?

**Debouncing** limits how frequently a function executes.

A debounced function runs only after a specified period has passed without another call. If it is called again during that period, the previous timer is cancelled and a new one starts.

> Wait until the action pauses, then execute the function.

### Why is debouncing useful?

Consider a search box. An `input` event can fire for every character typed:

```text
J
Ja
Jav
Java
JavaS
JavaSc
JavaScr
JavaScrip
JavaScript
```

Without debouncing, an application might send an API request for every change, causing unnecessary requests, server work, and repeated processing.

Debouncing waits until the user stops typing before processing the final input.

---

## 2. How debouncing works

Debouncing mainly uses:

- `setTimeout()`: schedules a function after a delay.
- `clearTimeout()`: cancels a scheduled timeout.

With a delay of 500 milliseconds:

| Time | User action | Result |
|---|---|---|
| `0 ms` | Types `J` | Timer 1 starts. |
| `200 ms` | Types `Ja` | Timer 1 is cancelled; Timer 2 starts. |
| `350 ms` | Types `Jav` | Timer 2 is cancelled; Timer 3 starts. |
| `850 ms` | No new input | Timer 3 completes and the function executes. |

The function executes 500 milliseconds after the **last** input, not 500 milliseconds after the first input.

---

## 3. Building debounce from scratch

### A normal function

```js
function search() {
  console.log("Searching...");
}

search();
```

Every call executes `search()` immediately.

### Adding `setTimeout()`

```js
function search() {
  setTimeout(() => {
    console.log("Searching...");
  }, 500);
}

search();
```

This delays execution by 500 milliseconds. However, calling `search()` multiple times still creates multiple timers.

### Cancelling the previous timer

```js
let timer;

function search() {
  clearTimeout(timer);

  timer = setTimeout(() => {
    console.log("Searching...");
  }, 500);
}
```

Each call now:

1. Cancels the previously scheduled timer.
2. Starts a new 500-millisecond timer.

The next step is to make this behavior reusable for any function.

---

## 4. A reusable `debounce()` function

```js
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

### How it works

#### `fn` and `delay`

```js
function debounce(fn, delay)
```

- `fn` is the function to delay.
- `delay` is the waiting period in milliseconds.

#### Closure preserves the timer

```js
let timer;
```

`timer` belongs to the `debounce()` call. The returned function continues to access it after `debounce()` has finished because of a closure.

Every call to the same returned function therefore shares the same timer and can cancel the previous timeout.

#### The returned function collects arguments

```js
return function (...args) {
```

The wrapper is returned instead of executing `fn` immediately. `...args` collects all arguments passed to the wrapper into an array.

#### Resetting the timer

```js
clearTimeout(timer);

timer = setTimeout(() => {
  fn.apply(this, args);
}, delay);
```

The previous timeout is cancelled, and a new one is scheduled. If no new call arrives before the delay expires, the original function runs.

`fn.apply(this, args)` preserves:

- the `this` value from the wrapper's invocation;
- all arguments passed to the wrapper.

This makes the utility reusable with different functions and objects.

---

## 5. Practical example: search box

### HTML

```html
<input type="text" id="search" placeholder="Search here..." />
```

### JavaScript

```js
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function handleSearch(event) {
  console.log("Searching for:", event.target.value);
}

const searchInput = document.getElementById("search");
const debouncedSearch = debounce(handleSearch, 500);

searchInput.addEventListener("input", debouncedSearch);
```

The event fires for every input change, but `debouncedSearch` keeps resetting its timer. `handleSearch()` runs only after the user stops typing for 500 milliseconds.

For the final input `JavaScript`, the output is:

```text
Searching for: JavaScript
```

---

## 6. Other practical uses

### Window resizing

```js
function handleResize() {
  console.log("Calculating layout...");
}

window.addEventListener(
  "resize",
  debounce(handleResize, 300)
);
```

The layout calculation runs after 300 milliseconds without another resize event.

### Form validation

```js
function validateInput(event) {
  console.log("Validating:", event.target.value);
}

const input = document.querySelector("#username");

input.addEventListener(
  "input",
  debounce(validateInput, 500)
);
```

### Auto-saving

```js
function saveDocument() {
  console.log("Saving document...");
}

const debouncedSave = debounce(saveDocument, 1000);
```

Call `debouncedSave()` whenever the document changes. The save runs one second after the last change.

---

## 7. Variations and limitations

### Trailing-edge debouncing

The implementation above is a **trailing-edge debounce**. It runs the function after no new call has occurred for the specified delay. This is the most common form of debouncing.

### Leading-edge debouncing

A leading-edge debounce runs immediately on the first call. Further calls during the waiting period are ignored, and another call can run after that period ends.

Leading-edge behavior requires additional logic. The implementation in this note is trailing-edge only.

### Debouncing does not cancel requests already started

Debouncing reduces how often requests are initiated, but it does not automatically cancel requests that have already started.

For example:

1. A request for `Java` begins.
2. A later request for `JavaScript` begins.
3. The `JavaScript` response arrives first.
4. The older `Java` response arrives afterward.

The older response could overwrite newer UI data. When stale responses must be prevented from updating the UI, use techniques such as `AbortController` or request identifiers.

### Create the debounced function once

Do not create a new debounce instance for every event:

```js
searchInput.addEventListener("input", (event) => {
  debounce(handleSearch, 500)(event);
});
```

Each event creates a separate timer, so the new instance cannot cancel the previous instance's timer.

Create one debounced function and reuse it:

```js
const debouncedSearch = debounce(handleSearch, 500);

searchInput.addEventListener("input", debouncedSearch);
```

### Return values

The original function runs later, after the timer expires. Therefore, the debounced wrapper does not synchronously return the original function's eventual result.

When a result must be consumed asynchronously, design the utility around a Promise or callback instead of expecting an immediate return value.

---

## 8. Debouncing vs. throttling

Both techniques control how frequently a function executes, but they solve different problems:

| Feature | Debouncing | Throttling |
|---|---|---|
| Execution | After a period of inactivity | At most once per specified interval |
| Timer behavior | Resets on each call | Does not continually reset the execution interval |
| Best suited for | Waiting until an action stops | Handling continuous events at a controlled rate |
| Example | Search input | Scroll tracking |

For a user scrolling continuously for five seconds:

- **Debouncing:** with a 500-millisecond delay, the function may run only after scrolling stops for 500 milliseconds.
- **Throttling:** with a 500-millisecond interval, the function can run approximately once every 500 milliseconds while scrolling continues.

Use debouncing for the final action after a pause. Use throttling for periodic execution during a continuous action.

---

## Interview practice

### What does this print?

```js
function debounce(fn, delay) {
  let timer;

  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function print() {
  console.log("Hello");
}

const debouncedPrint = debounce(print, 1000);

debouncedPrint();
debouncedPrint();
debouncedPrint();
```

Assuming all three calls happen within the 1000-millisecond delay, only the last timer runs:

```text
Hello
```

### Why is a closure needed?

The timer identifier must remain available between calls to the returned function. A closure preserves this shared timer state.

### Why use `clearTimeout()`?

It cancels the previous scheduled execution when a new call arrives before the delay expires.

### When does a trailing-edge debounced function execute?

After the specified delay has passed without another call.

### Does debouncing reduce event-listener calls?

No. The event listener can still run for every event. Debouncing reduces how often the expensive function inside the wrapper executes.

### Can debounce be used with API calls?

Yes. It is commonly used for search suggestions, filters, and other input-driven API requests to avoid sending a request for every input change.

---

## Quick reference

```js
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

Remember:

1. `setTimeout()` schedules execution after a delay.
2. `clearTimeout()` cancels the previous scheduled execution.
3. A closure preserves the timer between calls.
4. The original function executes after the specified period of inactivity.

## References

- [MDN: `setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN: `clearTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)
- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
