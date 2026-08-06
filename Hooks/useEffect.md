# useEffect

> برای اجرای `side effect` بعد از `render` — sync با سیستم‌های خارجی React.

---

## 📖 مفهوم

برای اجرای کد بعد از به‌روزرسانی DOM، از `useEffect` استفاده می‌شود: `fetch` داده، `subscription`، `timer`، دستکاری DOM و...

---

## چرا

کامپوننت‌های React باید `pure` در `render` باشند. هر کار `impure` (شبکه، `timer`، `log`) باید در `effect` جدا شود تا `render` قابل پیش‌بینی بماند.

---

## مشکل

- `dependency array` اشتباه → `stale closure` یا loop بی‌نهایت.
- فراموش کردن `cleanup` → memory leak.
- قرار دادن منطق `fetch` بدون cancel → race condition.
- استفاده برای derive `state` → anti-pattern.

---

## نحوه کار

1. React کامپوننت را `render` می‌کند.
2. DOM را commit می‌کند (به صفحه می‌رود).
3. `effect` اجرا می‌شود (معمولاً `async` نسبت به `paint`).
4. قبل از `re-run` یا `unmount`، تابع `cleanup` قبلی اجرا می‌شود.

---

## Syntax

```jsx
useEffect(setup, dependencies?);
```

```jsx
useEffect(() => {
  // setup
  return () => {
    // cleanup
  };
}, [dep1, dep2]);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `setup` | `() => void \| () => void` | تابع effect؛ optional cleanup برمی‌گرداند |
| `dependencies` | `unknown[]` (optional) | وابستگی‌ها؛ اگر حذف شود هر `render` اجرا می‌شود؛ `[]` فقط `mount`/`unmount` |

---

## مقدار بازگشتی

`undefined` — `effect` چیزی `return` نمی‌کند (فقط تابع `cleanup` از `setup`).

---

## Dependency Array — راهنمای کامل

| آرایه | رفتار |
|-------|-------|
| حذف شده | هر `render` اجرا می‌شود (نادر) |
| `[]` | فقط `mount` (`setup`) و `unmount` (`cleanup`) |
| `[a, b]` | وقتی `a` یا `b` تغییر کند |

**قانون:** هر مقداری از داخل effect که از scope بیرونی می‌آید و می‌تواند تغییر کند باید در `deps` باشد.

```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]); // count must be listed
```

---

## Cleanup — راهنمای کامل

تابع `cleanup` برای `undo` کردن `effect` قبلی است:

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser);

  return () => controller.abort(); // cancel on unmount or userId change
}, [userId]);
```

موارد رایج `cleanup`:
- `clearInterval` / `clearTimeout`
- `subscription.unsubscribe()`
- `abortController.abort()`
- `remove` کردن `event listener`

---

## مثال ساده

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds}s</p>;
}
```

---

## مثال واقعی

### Dashboard — sync با localStorage

```jsx
function DashboardPrefs() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (/* theme toggle UI */);
}
```

### Auth — redirect بعد از login

```jsx
function AuthGuard({ user, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;
  return children;
}
```

### E-commerce — track product view

```jsx
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setProduct(data);
      });

    analytics.track('product_view', { productId });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return product ? <ProductDetails product={product} /> : <Spinner />;
}
```

---

## اشتباهات

```jsx
// ❌ missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId changes ignored → stale data

// ❌ infinite loop
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ❌ effect for derived state
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);
// ✅ compute in render instead
const fullName = firstName + ' ' + lastName;
```

---

## Best Practices

- یک `effect` = یک `concern` (`fetch` جدا، `subscription` جدا).
- همیشه `cleanup` برای async/`subscription`/timer.
- از `eslint-plugin-react-hooks` `exhaustive-deps` پیروی کنید.
- برای `data fetching` در پروژه‌های جدید React Query/SWR را در نظر بگیرید.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| sync با API، browser API | محاسبه از `props`/`state` → `render` |
| `subscription`، timer | `event handler` logic |
| `DOM measurement` (اگر `layout effect` لازم نیست) | جایگزین `event handler` |

---

## ارتباط با مفاهیم

- [Effects.md](../Effects.md) — فلسفه effect و جداسازی `concern`
- [useLayoutEffect.md](./useLayoutEffect.md) — قبل از `paint`
- [useEffectEvent.md](./useEffectEvent.md) — رویداد `non-reactive` داخل `Effect` (React 19.2)
- [Lifecycle.md](../Lifecycle.md) — معادل `lifecycle` در کلاس

---

## نکات

- `Strict Mode` در dev، `effect` را دوبار اجرا می‌کند → `cleanup` را تست کنید.
- `useEffect` بعد از paint اجرا می‌شود → برای اندازه‌گیری DOM که کاربر نبیند `useLayoutEffect`.
- برای callback با latest `state` بدون re-run Effect: `useEffectEvent` (React 19.2).

---

## Interview

**سوال:** تفاوت `useEffect` با `useLayoutEffect`؟  
**جواب:** در `useEffect` اجرا بعد از `paint` (`non-blocking`) است؛ در `useLayoutEffect` قبل از `paint` (`blocking`) — برای جلوگیری از `flicker`.

**سوال:** چرا `dependency array` مهم است؟  
**جواب:** در React فقط وقتی `effect` دوباره اجرا می‌شود که `deps` تغییر کرده باشند؛ بدون `deps` درست `stale closure` یا `loop` می‌گیرید.

**سوال:** `cleanup` کی لازم است؟  
**جواب:** وقتی `effect` چیزی `persistent` می‌سازد (`listener`، `timer`، `subscription`) که باید قبل از `re-run` یا `unmount` پاک شود.

---

## خلاصه

با `useEffect` می‌توان `side effect` بعد از `render` را مدیریت کرد. `dependency array` را کامل بنویسید، `cleanup` فراموش نشود، و از `effect` برای منطق `pure render` استفاده نکنید.

---

## منابع

- [useEffect — react.dev](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects — react.dev](https://react.dev/learn/synchronizing-with-effects)
