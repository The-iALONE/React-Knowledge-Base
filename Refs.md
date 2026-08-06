# Refs — ارجاع به DOM و مقادیر پایدار

> با `ref` می‌توانید ارجاع به DOM node یا هر مقداری را نگه دارید که تغییر آن باعث `re-render` نمی‌شود.

## 📖 مفهوم

ارجاع (`ref` یا `Ref`) یک «جعبه» است که `.current` دارد. برخلاف `state`، تغییر `ref.current` کامپوننت را `re-render` نمی‌کند.

دو کاربرد اصلی:
1. **دسترسی به DOM** — `focus`، `scroll`، اندازه‌گیری
2. **نگهداری `mutable value`** — `timer ID`، مقدار قبلی، `instance` قبلی

## چرا این ویژگی وجود دارد؟

بعضی کارها (`focus` روی `input`، پخش ویدیو، `integration` با کتابخانه `imperative`) نیاز به دسترسی مستقیم به DOM دارند.

## چه مشکلی را حل می‌کند؟

- `escape` از مدل `declarative` برای کارهای `imperative`
- نگه‌داری مقدار بین `render`ها بدون `trigger` کردن `re-render`

## ⚙️ نحوه کار

```jsx
import { useRef, useEffect } from "react";

function SearchForm() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search products..." />;
}
```

## Syntax

```jsx
const ref = useRef(initialValue);
ref.current // خواندن/نوشتن

// روی DOM element:
<input ref={ref} />

// forward ref به فرزند (React 18):
const Child = forwardRef((props, ref) => <input ref={ref} />);

// React 19 — ref به‌عنوان prop معمولی:
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// ref callback با cleanup (React 19):
<div ref={(node) => {
  // setup
  return () => {
    // cleanup هنگام unmount
  };
}} />
```

## پارامترها

| `useRef(initial)` | مقدار اولیه `.current` |
| `ref={ref}` | اتصال به DOM element یا class instance |

## مقدار بازگشتی

`{ current: initialValue }` — `object` پایدار بین `render`ها

## مثال واقعی در پروژه

**جستجوی فیلم:** `useRef` برای نگه‌داری `abortController` درخواست `fetch` — با هر جستجوی جدید، درخواست قبلی `cancel` می‌شود بدون `re-render`.

```jsx
function useMovies(query) {
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    fetchMovies(query, { signal: controller.signal });
    return () => controller.abort();
  }, [query]);
}
```

## ⚠️ اشتباهات رایج

- ❌ خواندن/نوشتن `ref.current` در `render` (برای UI)
- ❌ استفاده از `ref` به‌جای `state` برای داده‌ای که UI را تغییر می‌دهد
- ❌ دستکاری DOM که React می‌تواند `declarative` انجام دهد

## 🚀 Best Practices

- ✅ `ref` فقط برای کارهای `imperative` (`focus`، `scroll`، `measure`)
- ✅ `state` برای هر چیزی که UI را تغییر می‌دهد
- ✅ `forwardRef` + `useImperativeHandle` برای `expose` کردن API به والد
- ✅ در React 19: `ref` را مستقیم به‌عنوان `prop` بپذیرید — `forwardRef` دیگر الزامی نیست
- ✅ `ref callback` می‌تواند تابع `cleanup` برگرداند (React 19)

## چه زمانی استفاده کنیم؟

- `focus`، `selection`، `scroll`
- `integration` با `chart`/`map library`
- نگه‌داری `timer`/`interval ID`
- جلوگیری از `re-render` (مقدار قبلی `props`)

## چه زمانی استفاده نکنیم؟

- نمایش داده در UI → `useState`
- محاسبه مشتق‌شده → `useMemo`

## ارتباط با مفاهیم دیگر

- [Hooks/useRef](./Hooks/useRef.md)
- [Hooks/useImperativeHandle](./Hooks/useImperativeHandle.md)
- [DOM Manipulation](./DOM-Manipulation.md)
- [Effects](./Effects.md)

## 💡 نکات مهم

- در React 19: `ref` `prop` معمولی است — `forwardRef` برای کد جدید لازم نیست.
- در React 19: `ref callback` می‌تواند تابع `cleanup` برگرداند؛ React دیگر `null` برای `unmount` صدا نمی‌زند.
- `ref.current` ممکن است در اولین `render` `null` باشد — معمولاً در `useEffect` استفاده کنید
- Strict Mode در `dev` ممکن است `ref` را دو بار `set` کند

## 🎯 سوالات رایج مصاحبه

- تفاوت `ref` و `state`؟
- چرا تغییر `ref` باعث `re-render` نمی‌شود؟

## خلاصه

با `ref` دسترسی `imperative` به DOM یا نگه‌داری مقدار پایدار بدون `re-render` ممکن است.

## 📚 منابع

- [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [useRef](https://react.dev/reference/react/useRef)
