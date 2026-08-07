# useDebugValue

> برای نمایش `label` خوانا در React DevTools برای `Custom Hook` — مخصوص نویسندگان کتابخانه.

> 🧭 پیش‌نیاز: [useId](./useId.md) · بعدی: [Escape Hatches — نمای کلی](../Escape-Hatches/README.md)

---

## 📖 مفهوم

برای افزودن مقدار `debug` به `Custom Hook` در React DevTools، از `useDebugValue` استفاده می‌شود. به‌جای نمایش داده خام (مثل `true`)، `label` قابل فهم (مثل `"Online"`) نشان داده می‌شود.

---

## چرا

وقتی `useOnlineStatus` را در DevTools باز می‌کنید، دیدن `true`/`false` کمک کمی می‌کند — «Online»/«Offline» خواناتر است. این `hook` فقط برای **تجربه دیباگ** است؛ روی رفتار اپ در `production` اثری ندارد.

---

## چه مشکلی را حل می‌کند؟

- فقط در DevTools دیده می‌شود — روی `runtime` اپ تأثیری ندارد.
- نباید به هر `Custom Hook` اضافه شود — فقط `hook`های `shared` با ساختار پیچیده.
- فقط داخل `Custom Hook` (تابع با پیشوند `use`) معتبر است.

---

## ⚙️ نحوه کار

1. در `top-level` Custom Hook، `useDebugValue(value)` صدا بزنید.
2. وقتی کامپوننتی که `hook` را صدا می‌زند `inspect` شود، `label` در DevTools نمایش داده می‌شود.
3. با `format` اختیاری، `formatting` فقط هنگام `inspect` اجرا می‌شود.

---

## Syntax

```jsx
useDebugValue(value);
useDebugValue(value, format);
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `value` | `any` | مقداری که در DevTools نمایش داده شود |
| `format` | `(value) => any` (optional) | تابع `format` — فقط هنگام `inspect` اجرا می‌شود |

---

## مقدار بازگشتی

`undefined`

---

## مثال

```jsx
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

در DevTools نمایش داده می‌شود: `OnlineStatus: "Online"` به‌جای `true`.

### `format` با تأخیر

```jsx
useDebugValue(date, (d) => d.toDateString());
```

`toDateString()` فقط وقتی `inspect` می‌کنید اجرا می‌شود — نه هر `render`.

---

## ⚠️ اشتباهات رایج

```jsx
// ❌ در کامپوننت معمولی (نه custom hook)
function Button() {
  useDebugValue('clicked'); // بی‌معنی
}

// ❌ روی هر hook ساده
function useCounter() {
  const [n, setN] = useState(0);
  useDebugValue(n); // overkill
}
```

---

## 🚀 Best Practices

- برای `hook`های `shared` کتابخانه با `state` داخلی پیچیده.
- `format` برای مقادیر سنگین (`Date`، `object` بزرگ).
- در `production` `tree-shake` می‌شود اگر `bundler` پشتیبانی کند.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| `custom hook` در بسته npm | `hook` ساده پروژه داخلی |
| `state` داخلی سخت برای `debug` | جایگزین `console.log` در `production` |
| بهبود DX تیم | `logic` اپ |

---

## ارتباط با مفاهیم دیگر

- [Custom-Hooks.md](../Custom-Hooks.md) — ساخت `custom hook` (M2)
- [useSyncExternalStore.md](./useSyncExternalStore.md) — مثال `useOnlineStatus`
- [Hooks/README.md](./README.md) — دسته «Other» در جدول `Hook`ها

---

## نکات

- React 16.8+.
- فقط `label` در DevTools — رفتار اپ را عوض نمی‌کند.
- با React DevTools extension کار می‌کند.

---

## Interview

**سوال:** `useDebugValue` چیست؟  
**جواب:** برای `label` خوانا در DevTools روی `custom hook` — مخصوص `library authors`.

---

## خلاصه

با `useDebugValue` فقط برای تجربهٔ دیباگ در DevTools استفاده می‌شود. روی `custom hook`های پیچیده `shared` — نه هر `hook`.

---

## 📚 منابع

- [useDebugValue — react.dev](https://react.dev/reference/react/useDebugValue)
