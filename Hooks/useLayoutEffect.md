# useLayoutEffect

> برای `side effect` همزمان بعد از به‌روزرسانی DOM و قبل از `paint` مرورگر.

> 🧭 پیش‌نیاز: [useEffect](./useEffect.md) · بعدی: [useInsertionEffect](./useInsertionEffect.md)

---

## 📖 مفهوم

برای اجرای کد بعد از به‌روزرسانی DOM و قبل از `paint` مرورگر، از `useLayoutEffect` استفاده می‌شود. کاربر تغییر بصری ناشی از `effect` را نمی‌بیند (اگر درست استفاده شود).

---

## چرا

گاهی باید DOM را بخوانید یا تغییر دهید **قبل از** نمایش به کاربر — مثلاً موقعیت `tooltip`، `sync` کردن `scroll`، `measure` و `adjust` فوری. با `useEffect` یک فریم `flicker` دیده می‌شود.

---

## چه مشکلی را حل می‌کند؟

- `blocking` است → روی `performance` تأثیر می‌گذارد.
- `overuse` باعث کندی UI می‌شود.
- در SSR warning می‌دهد (فقط client).

---

## ⚙️ نحوه کار

```
`render` → `commit` DOM → `useLayoutEffect` (blocking) → `paint` → `useEffect`
```

1. React `render` + `commit` DOM.
2. `useLayoutEffect` اجرا می‌شود — مرورگر هنوز `paint` نکرده (`blocking`).
3. مرورگر `paint` می‌کند — کاربر UI را می‌بیند.
4. سپس `useEffect`های عادی (بعد از `paint`).

### مقایسه سه Effect

| | `useInsertionEffect` | `useLayoutEffect` | `useEffect` |
|---|---------------------|-------------------|-------------|
| **زمان** | قبل از `layout effect`ها | قبل از `paint` | بعد از `paint` |
| **کاربرد** | `inject` CSS | `measure`/`sync` DOM | `fetch`، `subscription` |
| **برای اپ معمولی** | نادر | گاهی | پیش‌فرض |

---

## Syntax

```jsx
useLayoutEffect(setup, dependencies?);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `setup` | `() => void \| () => void` | مثل `useEffect` |
| `dependencies` | `unknown[]` | مثل `useEffect` |

---

## مقدار بازگشتی

`undefined`

---

## مثال ساده

```jsx
import { useRef, useLayoutEffect, useState } from 'react';

function Tooltip({ children, label }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setStyle({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, [label]);

  return (
    <div ref={ref}>
      {children}
      <span style={style}>{label}</span>
    </div>
  );
}
```

---

## مثال واقعی

### Dashboard — حفظ scroll position

```jsx
function DataGrid({ rows }) {
  const containerRef = useRef(null);
  const scrollTopRef = useRef(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTopRef.current;
    }
  }, [rows]);

  return (
    <div
      ref={containerRef}
      onScroll={(e) => {
        scrollTopRef.current = e.target.scrollTop;
      }}
    >
      {/* rows */}
    </div>
  );
}
```

### Auth — focus اول input

```jsx
function LoginForm() {
  const emailRef = useRef(null);

  useLayoutEffect(() => {
    emailRef.current?.focus();
  }, []);

  return <input ref={emailRef} type="email" />;
}
```

### E-commerce — animate cart badge

```jsx
function CartBadge({ count }) {
  const badgeRef = useRef(null);

  useLayoutEffect(() => {
    const el = badgeRef.current;
    if (!el) return;
    el.classList.add('bounce');
    const t = setTimeout(() => el.classList.remove('bounce'), 300);
    return () => clearTimeout(t);
  }, [count]);

  return <span ref={badgeRef}>{count}</span>;
}
```

---

## ⚠️ اشتباهات رایج

```jsx
// ❌ useLayoutEffect for data fetch
useLayoutEffect(() => {
  fetch('/api/data').then(setData);
}, []);

// ✅ useEffect for fetch
useEffect(() => {
  fetch('/api/data').then(setData);
}, []);

// ❌ useLayoutEffect when useEffect is enough
useLayoutEffect(() => {
  document.title = title;
}, [title]);
```

---

## 🚀 Best Practices

- پیش‌فرض `useEffect` است — فقط وقتی `flicker` یا `measure-before-paint` لازم است از `useLayoutEffect` استفاده کنید.
- `cleanup` مثل `useEffect`.
- در SSR از `useEffect` یا `typeof window` `guard` استفاده کنید.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `measure` DOM + فوری `update` UI | `fetch`، `analytics` |
| موقعیت‌دهی `tooltip`/`popover` | هر `effect` عمومی |
| بازیابی `scroll` | منطق `business` |

---

## ارتباط با مفاهیم دیگر

- [useEffect.md](./useEffect.md) — effect غیرمسدودکننده (پیش‌فرض)
- [useInsertionEffect.md](./useInsertionEffect.md) — قبل از `layout effect`ها
- [useEffectEvent.md](./useEffectEvent.md) — callback بدون `re-run`
- [useRef.md](./useRef.md) — دسترسی DOM برای `measure`
- [Effects.md](../Effects.md) — فلسفه `effect` (M2)
- [Performance/Profiling.md](../Performance/Profiling.md) — اگر `layout effect` کند شد

---

## نکات

- امضای یکسان با `useEffect`؛ فقط `timing` فرق دارد.
- React 19+: در RSC استفاده نمی‌شود (فقط `Client Component`).

---

## Interview

**سوال:** کی `useLayoutEffect` به جای `useEffect`؟  
**جواب:** وقتی باید DOM را قبل از `paint` بخوانید/بنویسید تا کاربر `flicker` نبیند.

---

## خلاصه

با `useLayoutEffect` می‌توان قبل از `paint` اندازه‌گیری و `sync` کردن `layout` را انجام داد — معادل `useEffect` ولی قبل از `paint`. در غیر این صورت `useEffect` کافی است.

---

## 📚 منابع

- [useLayoutEffect — react.dev](https://react.dev/reference/react/useLayoutEffect)
- [Synchronizing with Effects — react.dev](https://react.dev/learn/synchronizing-with-effects)
- [useEffect — react.dev](https://react.dev/reference/react/useEffect) — پیش‌فرض
