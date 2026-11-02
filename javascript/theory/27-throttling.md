# JavaScript: Throttling

## 1. What is throttling?

**Throttling** limits how frequently a function can execute.

It allows a function to execute at most once within a specified interval, even when it is called repeatedly.

> Allow one execution, then wait for the interval before allowing another.

### Why is throttling useful?

A browser may trigger the `scroll` event many times in a short period:

```js
window.addEventListener("scroll", () => {
  console.log("Scrolling...");
});
```

If the callback performs expensive work, processing every event can cause unnecessary computation. Throttling controls how often that work runs.

---

## 2. How throttling works

Suppose the throttle interval is 1000 milliseconds:

| Time | Event | Result |
|---|---|---|
| `0 ms` | Event 1 | Function executes. |
| `200 ms` | Event 2 | Ignored. |
| `400 ms` | Event 3 | Ignored. |
| `700 ms` | Event 4 | Ignored. |
| `1000 ms` | Event 5 | Function executes. |
| `1200 ms` | Event 6 | Ignored. |
| `2000 ms` | Event 7 | Function executes. |

The function executes at controlled intervals while events continue to arrive.

> Throttling does not execute a function automatically every second. It allows execution when an event occurs and the required interval has passed.

---

## 3. Building throttling from scratch

### A normal function

```js
function handleScroll() {
  console.log("Handling scroll...");
}

handleScroll();
```

Every call executes the function immediately.

### Tracking the last execution

```js
let lastCall = 0;

function handleScroll() {
  const now = Date.now();

  if (now - lastCall >= 1000) {
    console.log("Handling scroll...");
    lastCall = now;
  }
}
```

- `lastCall` stores the timestamp of the last execution.
- `now` stores the current timestamp.
- `now - lastCall` gives the elapsed time.
- The function runs only when at least 1000 milliseconds have passed.

The next step is to make the behavior reusable for any function.

---

## 4. A reusable `throttle()` function

```js
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

### How it works

#### `fn` and `delay`

```js
function throttle(fn, delay)
```

- `fn` is the function to throttle.
- `delay` is the minimum interval between executions, in milliseconds.

#### Closure preserves the timestamp

```js
let lastCall = 0;
```

`lastCall` belongs to the `throttle()` call. The returned function continues to access it through a closure after `throttle()` finishes.

Every call to the same returned function therefore checks the same previous execution time.

#### Checking the elapsed time

```js
const now = Date.now();

if (now - lastCall >= delay) {
```

Execution is allowed only when the elapsed time is at least the requested delay.

#### Updating and executing

```js
lastCall = now;
fn.apply(this, args);
```

The timestamp is updated before the original function runs. `apply()` preserves the wrapper's `this` value and forwards all arguments.

This implementation is **leading-edge throttling**: the first eligible call runs immediately, and calls during the interval are ignored.

---

## 5. Practical example: window scrolling

### HTML

```html
<div style="height: 2000px;">
  Scroll down the page.
</div>
```

### JavaScript

```js
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

function handleScroll() {
  console.log("Handling scroll event...");
}

const throttledScroll = throttle(handleScroll, 500);

window.addEventListener("scroll", throttledScroll);
```

While the user scrolls:

- The first eligible event runs `handleScroll()`.
- Events within 500 milliseconds are ignored.
- After 500 milliseconds, the next incoming event can run the function.
- This continues while scrolling.

---

## 6. Other practical uses

### Mouse movement

```js
function handleMouseMove(event) {
  console.log(event.clientX, event.clientY);
}

const throttledMouseMove = throttle(handleMouseMove, 100);

document.addEventListener("mousemove", throttledMouseMove);
```

The handler runs at most once per 100 milliseconds.

### Preventing repeated button actions

```js
function handleClick() {
  console.log("Button action executed");
}

const throttledClick = throttle(handleClick, 2000);

button.addEventListener("click", throttledClick);
```

The first click runs immediately. Further clicks are ignored until two seconds have passed since the last execution.

For payments or other critical operations, throttling alone is not sufficient. Server-side duplicate-request protection is also necessary.

### Window resizing

```js
function handleResize() {
  console.log("Updating layout...");
}

window.addEventListener(
  "resize",
  throttle(handleResize, 300)
);
```

The layout handler runs at most once every 300 milliseconds while resize events continue.

---

## 7. Types of throttling

### Leading-edge throttling

The function runs immediately on the first eligible call. Calls during the interval are ignored. After the interval ends, the next incoming call can run the function.

This is the behavior of the implementation in this note.

### Trailing-edge throttling

The function runs after the waiting interval. If multiple calls occur during that interval, the latest call's arguments can be retained for execution.

### Leading plus trailing throttling

The function runs immediately on the first call and can also run once at the end of the interval using the latest arguments.

The basic implementation here is leading-edge only. It does not automatically execute a final pending call when events stop.

---

## 8. Important rules and common mistakes

### Why is a closure needed?

`lastCall` must retain its value between calls to the throttled function. Without shared state, each invocation would lose the previous execution timestamp.

### Why update `lastCall` before executing `fn`?

```js
lastCall = now;
fn.apply(this, args);
```

Updating the timestamp first ensures that the next invocation sees the latest execution time.

### Create the throttled function once

Do not create a new throttle instance for every event:

```js
button.addEventListener("click", () => {
  throttle(handleClick, 1000)();
});
```

Each click creates a separate `lastCall` variable, so previous calls cannot control the new instance.

Create one throttled function and reuse it:

```js
const throttledClick = throttle(handleClick, 1000);

button.addEventListener("click", throttledClick);
```

Now every event shares the same timestamp.

### Does throttling stop event listeners from firing?

No. The event listener can still run for every event. Throttling controls how often the original function inside the wrapper executes.

### Does throttling guarantee the final event runs?

Not with this leading-edge implementation. If the last event occurs during the active interval, it is ignored. A trailing-edge implementation is needed when the final event must also be processed.

---

## 9. Debouncing vs. throttling

| Feature | Debouncing | Throttling |
|---|---|---|
| Execution | After a period of inactivity | At most once per interval |
| Timer behavior | Resets on every call | Controls the allowed execution frequency |
| During continuous events | Waits for events to stop | Can execute periodically |
| Typical use | Search suggestions | Scroll tracking |
| Final event | Runs after a pause with trailing debounce | Not necessarily run with leading-only throttle |

For a user scrolling continuously for five seconds:

- **Debouncing:** with a 500-millisecond delay, the function runs after scrolling stops for 500 milliseconds.
- **Throttling:** with a 500-millisecond interval, the function can run approximately once every 500 milliseconds while scrolling continues.

Use debouncing for the final action after a pause. Use throttling for periodic execution during a continuous action.

---

## Interview practice

### What does this print?

```js
function throttle(fn, delay) {
  let lastCall = 0;

  return function () {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn();
    }
  };
}

function print() {
  console.log("Hello");
}

const throttledPrint = throttle(print, 1000);

throttledPrint();
throttledPrint();
throttledPrint();
```

Assuming all three calls happen within one second, only the first call executes the original function:

```text
Hello
```

### Why use `Date.now()`?

It provides the current timestamp, which lets the function calculate the time since the previous execution.

### Why is a closure needed?

It retains the previous execution timestamp between calls to the returned function.

### Does this throttle execute immediately?

Yes. It is a leading-edge implementation, so the first eligible call executes immediately.

### Can throttle be used with `scroll` and `mousemove`?

Yes. Both events can fire frequently, so throttling helps control how often expensive handlers execute.

### What is the main difference between debounce and throttle?

Debouncing waits until events stop for a specified duration. Throttling allows execution at a controlled frequency while events continue.

---

## Quick reference

```js
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

Remember:

1. `Date.now()` provides the current timestamp.
2. `lastCall` stores the previous execution time.
3. The function executes only after the required interval has passed.
4. A closure preserves the timestamp between invocations.

## References

- [MDN: `Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
- [MDN: `setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN: `clearTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)
- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
