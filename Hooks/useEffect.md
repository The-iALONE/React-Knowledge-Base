# useEffect

> برای اجرای `side effect` بعد از `render` — sync با سیستم‌های خارجی React.

> 🧭 پیش‌نیاز: [useState](./useState.md) · بعدی: [useLayoutEffect](./useLayoutEffect.md)

---

## 📖 مفهوم

برای اجرای کد بعد از به‌روزرسانی DOM، از `useEffect` استفاده می‌شود: `fetch` داده، `subscription`، `timer`، دستکاری DOM و...

---

## چرا

کامپوننت‌های React باید در `render` **خالص** (`pure`) باشند — یعنی با همان `props`/`state` همیشه همان JSX را برگردانند. هر کار `impure` (شبکه، `timer`، `log`، `subscription`) باید در `effect` جدا شود.

مثال ذهنی: `render` مثل نقاشی روی بوم است؛ `effect` مثل تماس با بیرون از اتاق نقاشی (API، ساعت، بلندگو). اگر همه چیز را داخل `render` بریزید، پیش‌بینی رفتار سخت می‌شود ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)).

---

## چه مشکلی را حل می‌کند؟

- `dependency array` اشتباه → `stale closure` یا loop بی‌نهایت.
- فراموش کردن `cleanup` → memory leak.
- قرار دادن منطق `fetch` بدون cancel → race condition.
- استفاده برای derive `state` → anti-pattern.

---

## ⚙️ نحوه کار

```
`render` → `commit` DOM → `paint` (کاربر می‌بیند) → `useEffect` اجرا
                                              ↓
                                    `cleanup` قبل از `re-run` / `unmount`
```

1. React کامپوننت را `render` می‌کند.
2. DOM را `commit` می‌کند (به صفحه می‌رود).
3. مرورگر `paint` می‌کند — کاربر UI را می‌بیند.
4. `effect` اجرا می‌شود (معمولاً **بعد از** `paint` — `non-blocking`).
5. قبل از `re-run` یا `unmount`، تابع `cleanup` قبلی اجرا می‌شود.

> برای اندازه‌گیری DOM **قبل از** `paint` (جلوگیری از `flicker`) → [`useLayoutEffect`](./useLayoutEffect.md).

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

## ⚠️ اشتباهات رایج

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

## 🚀 Best Practices

- یک `effect` = یک `concern` (`fetch` جدا، `subscription` جدا).
- همیشه `cleanup` برای async/`subscription`/`timer`.
- از `eslint-plugin-react-hooks` `exhaustive-deps` پیروی کنید.
- قبل از `useEffect` برای `fetch` بپرسید: آیا واقعاً `effect` لازم است؟ ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect))
- برای `data fetching` با `cache` و `invalidation` در پروژه‌های جدید [React Query](../State-Management/React-Query.md) را در نظر بگیرید.
- برای `callback` با آخرین `state` بدون اضافه کردن به `deps`: [`useEffectEvent`](./useEffectEvent.md) (React 19.2).

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| sync با API، browser API | محاسبه از `props`/`state` → `render` |
| `subscription`، timer | `event handler` logic |
| `DOM measurement` (اگر `layout effect` لازم نیست) | جایگزین `event handler` |

---

## ارتباط با مفاهیم دیگر

- [Effects.md](../Effects.md) — فلسفه `effect` و جداسازی `concern` (M2)
- [useLayoutEffect.md](./useLayoutEffect.md) — قبل از `paint`
- [useEffectEvent.md](./useEffectEvent.md) — رویداد `non-reactive` داخل `Effect` (React 19.2)
- [Lifecycle.md](../Lifecycle.md) — معادل `lifecycle` در کلاس
- [State-Management/React-Query.md](../State-Management/React-Query.md) — جایگزین `useEffect` + `fetch` برای دادهٔ سرور

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

## 📚 منابع

- [useEffect — react.dev](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects — react.dev](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect)
- [Separating Events from Effects — react.dev](https://react.dev/learn/separating-events-from-effects)
