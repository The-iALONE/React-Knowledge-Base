# Effects — `side effect`ها در React

> 🧭 پیش‌نیاز: [DOM Manipulation](./DOM-Manipulation.md) · بعدی: [Lifecycle](./Lifecycle.md)

> برای همگام‌سازی کامپوننت با سیستم‌های خارجی — API، `subscription`، `timer`، DOM — از `useEffect` استفاده کنید.

## 📖 مفهوم

عملیات جانبی (`effect` یا `Side Effect`) عملیاتی است که خارج از `render` انجام می‌شود: دریافت (`fetch`) داده، `subscribe` به `event`، `setInterval`، دستکاری DOM. در `function components` با `useEffect` (یا `useLayoutEffect`) مدیریت می‌شود.

## چرا این ویژگی وجود دارد؟

تابع `render` باید `pure` باشد — بدون `side effect`. `effect`ها جای مناسب برای کارهای `impure` بعد از `render` هستند.

## چه مشکلی را حل می‌کند؟

- دریافت (`fetch`) داده از API
- اشتراک (`subscribe`/`unsubscribe`) — `WebSocket`، `event listener`
- همگام‌سازی (`sync`) با `localStorage`
- `timer` و `animation`

## ⚙️ نحوه کار

```jsx
useEffect(() => {
  // 1. Setup — بعد از commit به DOM
  const controller = new AbortController();
  fetch(`/api/products?q=${query}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setProducts);

  // 2. Cleanup — قبل از effect بعدی یا unmount
  return () => controller.abort();
}, [query]); // 3. Dependency array
```

**آرایه وابستگی (`Dependency Array`):**
| آرایه | رفتار |
|-------|-------|
| `[dep1, dep2]` | فقط وقتی `dep` تغییر کند اجرا شود |
| `[]` | فقط `mount` (و `cleanup` در `unmount`) |
| حذف آرایه | **هر `render`** (معمولاً اشتباه) |

## Syntax

```jsx
useEffect(setup, dependencies?)
useEffect(() => { ... }, [dep]);
useEffect(() => { ... return cleanup; }, [dep]);
```

## مثال واقعی در پروژه

**لیست کابین‌ها:** دریافت (`fetch`) با React Query جایگزین `useEffect` خام شده؛ اما `pattern` اصلی همان است — `fetch` در `effect`، `cleanup` با `abort`.

```jsx
useEffect(() => {
  document.title = `Results: ${results.length}`;
}, [results.length]);
```

## ⚠️ اشتباهات رایج

- ❌ فراموش کردن `dependency` → `stale closure`
- ❌ `dependency` اضافی → `loop` بی‌نهایت
- ❌ دریافت (`fetch`) بدون `cleanup` (`race condition`)
- ❌ `setState` در `effect` بدون `dependency` مناسب

## 🚀 Best Practices

- ✅ `dependency array` کامل (ESLint `react-hooks/exhaustive-deps`)
- ✅ `cleanup` برای `subscription`/`timer`/`fetch`
- ✅ برای `fetch`: React Query یا SWR
- ✅ `effect` جدا برای `concern` جدا
- ✅ برای منطق رویداد داخل `effect` از [`useEffectEvent`](./Hooks/useEffectEvent.md) (React 19) استفاده کنید — وابستگی اضافی کمتر

## چه زمانی استفاده کنیم؟

- همگام‌سازی (`sync`) با `external system`
- دریافت (`fetch`) (اگر React Query ندارید)
- دستکاری DOM بعد از `render`

## چه زمانی استفاده نکنیم؟

- محاسبه از `props`/`state` → `render` یا `useMemo`
- `logic` در `event handler` → داخل `handler`
- `init state` از `prop` → `initial state` در `useState`

## ارتباط با مفاهیم دیگر

- [Hooks/useEffect](./Hooks/useEffect.md)
- [Hooks/useLayoutEffect](./Hooks/useLayoutEffect.md)
- [Hooks/useEffectEvent](./Hooks/useEffectEvent.md)
- [Lifecycle](./Lifecycle.md)
- [State-Management/React-Query](./State-Management/React-Query.md)

## 💡 نکات مهم

- `effect` بعد از **`paint`** اجرا می‌شود (`useEffect`) — برای `layout` قبل از `paint`: `useLayoutEffect`
- Strict Mode در `dev` `effect` را **دو بار** اجرا می‌کند — `cleanup` باید درست باشد

## 🎯 سوالات رایج مصاحبه

- `dependency array` چطور کار می‌کند؟
- تفاوت `useEffect` و `useLayoutEffect`؟
- `race condition` در `fetch` چیست؟

## خلاصه

با `useEffect` می‌توانید `side effect` بعد از `render` اجرا کنید. `dependency` + `cleanup` = کلید درست.

## 📚 منابع

- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [useEffect](https://react.dev/reference/react/useEffect)
