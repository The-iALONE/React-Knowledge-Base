# Concurrent Features — رندر همزمان

> قابلیت‌های React 18+ برای رندر قابل `interrupt`، اولویت‌بندی `update`ها و UI واکنش‌گرا.

> 🧭 پیش‌نیاز: [Escape Hatches — نمای کلی](./README.md) · بعدی: [Suspense](./Suspense.md)

---

## 📖 مفهوم

در React 18 به بعد، موتور رندر می‌تواند کار را `interrupt` کند، `update`های فوری را اول `commit` کند و کارهای سنگین را در پس‌زمینه انجام دهد. این مدل «Concurrent Rendering» نام دارد و پایه `Suspense`، `useTransition` و `useDeferredValue` است.

---

## چرا

در رندر سنتی (`blocking`)، یک `render` سنگین UI را `freeze` می‌کند — کاربر تایپ می‌کند ولی `input` واکنش نمی‌دهد. با مدل `Concurrent Rendering`، اولویت به تعامل کاربر داده می‌شود.

---

## چه مشکلی را حل می‌کند؟

- `freeze` شدن UI هنگام `render` سنگین
- `loading state` دستی پراکنده برای به‌روزرسانی‌های کند
- عدم امکان `interrupt` کردن رندر در حال انجام

---

## ⚙️ نحوه کار

### فازهای رندر

```
Trigger → Render Phase (قابل interrupt) → Commit Phase (اتمی)
```

- **Render Phase:** محاسبه JSX — قابل `interrupt` و از سرگیری
- **Commit Phase:** اعمال روی DOM — اتمی، غیرقابل `interrupt`

### اولویت‌بندی

| نوع `update` | مثال                  | اولویت                   |
| ------------ | --------------------- | ------------------------ |
| `urgent`     | تایپ، کلیک، `hover`   | بالا                     |
| `transition` | فیلتر لیست، تغییر tab | پایین — قابل `interrupt` |

---

## APIهای Concurrent

| API                | نقش                                        | فایل                                                     |
| ------------------ | ------------------------------------------ | -------------------------------------------------------- |
| `useTransition`    | علامت‌گذاری `update` به‌عنوان `non-urgent` | [Hooks/useTransition.md](../Hooks/useTransition.md)       |
| `useDeferredValue` | `defer` مقدار برای نمایش                   | [Hooks/useDeferredValue.md](../Hooks/useDeferredValue.md) |
| `useOptimistic`    | UI خوش‌بینانه قبل از پاسخ سرور             | [Hooks/useOptimistic.md](../Hooks/useOptimistic.md)       |
| `Suspense`         | مرز `loading` `declarative`                | [Suspense.md](./Suspense.md)                             |
| `startTransition`  | API `imperative` برای `transition`         | زیر                                                      |

### `startTransition` (بدون Hook)

```jsx
import { startTransition } from "react";

function handleTabChange(tab) {
  startTransition(() => {
    setTab(tab);
    setContent(loadContent(tab));
  });
}
```

---

## Automatic Batching

از React 18، همه `state update`ها (حتی در `setTimeout`، `fetch`، `native event`) به‌صورت خودکار `batch` می‌شوند — یک `re-render` به‌جای چندتا.

```jsx
// React 18+: یک re-render
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}, 1000);
```

---

## تفاوت با گزینه‌های مشابه

| ابزار | برای چه | `async`/`promise` |
| ----- | ------- | ----------------- |
| `useTransition` | `state update` سنگین (فیلتر، tab) | خیر — فقط `sync setState` |
| `useDeferredValue` | `defer` مقدار نمایشی (جایگزین `debounce` سبک) | خیر |
| `Suspense` + `use()` | انتظار `promise` در `render` | بله |
| `flushSync` | `update` فوری که باید همین الان `commit` شود | خیر |

### `flushSync` — وقتی `transition` کافی نیست

گاهی باید DOM بلافاصله به‌روز شود — مثلاً قبل از `measure` یا `scroll`. در این موارد `startTransition` مناسب نیست؛ از `flushSync` استفاده کنید:

```jsx
import { flushSync } from "react-dom";

flushSync(() => {
  setExpanded(true);
});
// DOM الان به‌روز است — measure/scroll امن
```

`flushSync` را کم استفاده کنید — `transition` برای اکثر موارد UX بهتر است.

---

## Syntax

```jsx
import { useState, useTransition, useDeferredValue, useMemo, startTransition } from "react";

// Hook
const [isPending, startTransition] = useTransition();
const deferredQuery = useDeferredValue(query);

// Imperative
startTransition(() => setTab("settings"));
```

---

## 💡 مثال ساده

```jsx
import { useState, useTransition, useDeferredValue, useMemo } from "react";

function SearchPage({ items }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase()),
    );
  }, [items, deferredQuery]);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value); // urgent — input فوراً به‌روز می‌شود
    startTransition(() => {
      // اگر علاوه بر deferredQuery، setState سنگین دیگری دارید اینجا بزنید
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>در حال فیلتر...</p>}
      <List items={filtered} />
    </div>
  );
}
```

---

## مثال واقعی در پروژه

در اپ fast-react-pizza، فیلتر منو با `useTransition` هنگام تایپ در جستجو اجرا می‌شود — `input` فوراً واکنش می‌دهد و لیست منو در `transition` به‌روز می‌شود.

---

## 🚀 Best Practices

- ابتدا پروفایل کنید — همه `render` به `transition` نیاز ندارند
- `useTransition` برای `state update` سنگین؛ `Suspense` برای `promise`
- `isPending` را برای `feedback` بصری استفاده کنید
- از `useDeferredValue` برای `defer` نمایش مقدار (مثل نتایج جستجو) استفاده کنید

---

## ⚠️ اشتباهات رایج

- انتظار `await` داخل `startTransition` — فقط `sync setState`
- استفاده از `useTransition` برای هر `fetch` — `Suspense`/`React Query` مناسب‌تر
- فرض `Concurrent Mode` به‌عنوان `opt-in` — از React 18 پیش‌فرض است

---

## ارتباط با مفاهیم دیگر

- [Suspense.md](./Suspense.md) · [Lazy-Loading.md](./Lazy-Loading.md)
- [Hooks/use.md](../Hooks/use.md)
- [Performance/Render-Cycle.md](../Performance/Render-Cycle.md)
- [README.md](./README.md)

---

## خلاصه

با مدل `Concurrent Rendering`، React می‌تواند `update` فوری را اول انجام دهد و کار سنگین را `interrupt` کند. `useTransition`/`useDeferredValue` برای `state`، `Suspense` برای `promise` — همه روی همین موتور ساخته شده‌اند.

---

## 📚 منابع

- [Concurrency — react.dev](https://react.dev/learn/concurrency)
- [useTransition — react.dev](https://react.dev/reference/react/useTransition)
- [useDeferredValue — react.dev](https://react.dev/reference/react/useDeferredValue)
- [flushSync — react.dev](https://react.dev/reference/react-dom/flushSync)
