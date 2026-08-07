# useRef

> برای نگه‌داری یک مقدار `mutable` بین `render`ها — تغییر آن باعث `re-render` نمی‌شود.

> 🧭 پیش‌نیاز: [useCallback](./useCallback.md) · بعدی: [useContext](./useContext.md)

---

## 📖 مفهوم

برای نگه‌داری یک شیء پایدار `{ current: value }` بین `render`ها، از `useRef` استفاده می‌شود. می‌توان `.current` را بدون `re-render` خواند و نوشت. رایج‌ترین کاربرد: ارجاع به `DOM element`.

---

## چرا

بعضی داده‌ها باید بین `render`ها حفظ شوند اما UI را به‌روز نکنند: شناسهٔ `timer`، `AbortController`، «مقدار قبلی `props`»، موقعیت `scroll`. همچنین برای دسترسی `imperative` به DOM (`focus`، `play`، `measure`) لازم است — جایی که React ترجیح می‌دهد `declarative` باشید ولی گاهی به DOM مستقیم نیاز دارید.

---

## چه مشکلی را حل می‌کند؟

- نوشتن `ref.current` برای نمایش در UI → UI به‌روز نمی‌شود.
- خواندن ref در `render` برای تصمیم‌گیری UI → anti-pattern.
- `ref` جایگزین `state` نیست؛ فقط وقتی `re-render` لازم نیست.

---

## ⚙️ نحوه کار

1. `useRef(initial)` یک box با `.current = initial` می‌سازد.
2. همان object در همه `render`ها برمی‌گردد.
3. تغییر `.current`، `re-render` را `trigger` نمی‌کند.
4. وقتی `ref={myRef}` روی JSX می‌گذارید، React بعد از mount، element را در `.current` قرار می‌دهد.

---

## Syntax

```jsx
const ref = useRef(initialValue);
ref.current // read / write

// DOM:
<input ref={ref} />

// React 19 — ref به‌عنوان prop در کامپوننت سفارشی:
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// ref callback با cleanup (React 19):
<div ref={(node) => {
  node?.focus();
  return () => { /* cleanup on unmount */ };
}} />
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `initialValue` | `T` | مقدار اولیه `.current` (فقط mount اول استفاده می‌شود) |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `ref` | `{ current: T }` | object پایدار بین renderها |

### الگوی «مقدار قبلی»

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

`ref.current` در `render` فعلی هنوز مقدار **قبل** از `effect` را نشان می‌دهد.

---

## مثال ساده

```jsx
import { useRef, useEffect } from 'react';

function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

---

## مثال واقعی

### Dashboard — cancel درخواست `fetch`

```jsx
function useMovies(query) {
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(`/api/movies?q=${query}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setMovies);

    return () => controller.abort();
  }, [query]);
}
```

### Auth — نگه‌داری interval بدون `re-render`

```jsx
function SessionTimeout({ onExpire }) {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      if (isSessionExpired()) onExpireRef.current();
    }, 60_000);
    return () => clearInterval(id);
  }, []);
}
```

### E-commerce — شمارنده کلیک بدون `state`

```jsx
function TrackClicks({ productId }) {
  const clickCount = useRef(0);

  function handleClick() {
    clickCount.current += 1;
    analytics.track('product_click', { productId, count: clickCount.current });
  }

  return <button onClick={handleClick}>View details</button>;
}
```

---

## ⚠️ اشتباهات رایج

```jsx
// ❌ ref برای UI
const countRef = useRef(0);
return <p>{countRef.current}</p>; // never updates UI

// ✅ useState for UI
const [count, setCount] = useState(0);

// ❌ read ref in render for conditional UI
if (inputRef.current?.value) { /* ... */ }

// ❌ mutate ref during render in Strict Mode issues
ref.current = compute(); // do in effect or event
```

---

## 🚀 Best Practices

- دسترسی DOM: بعد از `mount` در `useEffect` یا `useLayoutEffect`.
- `callback ref` برای `dynamic elements`: `ref={(el) => { ... }}`.
- برای latest callback در effect: `ref.current = fn` در `render` + خواندن در effect.
- `state` = `immutable` updates؛ ref = `mutable` box.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `focus`، `scroll`، کنترل `media` | داده‌ای که UI نشان می‌دهد |
| timer ID، abort controller | جایگزین `state` |
| previous value pattern | derive `state` |

---

## ارتباط با مفاهیم دیگر

- [Refs.md](../Refs.md) — مفاهیم `ref`، `forwardRef`، ref as prop (M2)
- [useImperativeHandle.md](./useImperativeHandle.md) — سفارشی‌سازی `ref` API
- [DOM-Manipulation.md](../DOM-Manipulation.md)
- [useEffectEvent.md](./useEffectEvent.md) — جایگزین رسمی الگوی `ref` + latest callback (React 19.2)

---

## نکات

- `ref` به‌صورت `synchronous` است — بلافاصله بعد از نوشتن قابل خواندن (برخلاف `state`).
- React 19: `ref` به‌عنوان `prop` — دیگر `forwardRef` برای کد جدید الزامی نیست.
- React 19: `ref callback` می‌تواند تابع `cleanup` برگرداند.
- در Strict Mode، ref به DOM ممکن است موقتاً null شود.
- `useRef` ≠ `createRef` — `createRef` در هر `render` `object` جدید می‌سازد.

---

## Interview

**سوال:** تفاوت `useRef` و `useState`؟  
**جواب:** در `useState` تغییر باعث `re-render` می‌شود؛ در `useRef` تغییر `.current` بدون `re-render` است. `state` به‌صورت `async` `batch` می‌شود؛ `ref` همزمان (`sync`) است.

**سوال:** چرا `ref` برای DOM بعد از `render` در دسترس است؟  
**جواب:** در React ابتدا `render` و `commit` DOM انجام می‌شود، سپس `ref` پر می‌شود.

---

## خلاصه

با `useRef` یک جعبه `mutable` پایدار ساخته می‌شود — برای DOM و مقادیر بین `render` بدون `re-render`. برای UI از `state` استفاده کنید.

---

## 📚 منابع

- [useRef — react.dev](https://react.dev/reference/react/useRef)
- [Manipulating the DOM with Refs — react.dev](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Referencing Values with Refs — react.dev](https://react.dev/learn/referencing-values-with-refs)
