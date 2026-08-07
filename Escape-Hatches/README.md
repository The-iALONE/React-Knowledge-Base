# Escape Hatches — خروج از مدل declarative

> مکانیزم‌های React برای کارهایی که نمی‌توان یا نباید فقط با `props` و `state` انجام داد — از `ref` تا `Suspense` و RSC.

> 🧭 پیش‌نیاز: [`useDebugValue`](../Hooks/useDebugValue.md) · [Concurrent Hooks](../Hooks/useTransition.md) · بعدی: [Concurrent Features](./Concurrent-Features.md)

---

## 📖 مفهوم

گاهی باید از مدل `declarative` React خارج شوید — مثلاً وقتی باید به DOM `focus` بدهید، `subscription` شبکه را مدیریت کنید، یا داده را از عمق درخت بدون `prop drilling` بخوانید. این مسیرها «Escape Hatch» نامیده می‌شوند — راه‌های رسمی برای کارهایی که مدل پیش‌فرض پوشش نمی‌دهد.

در React مدرن، علاوه بر `ref`/`effect`/`context` کلاسیک (M2/M3)، مفاهیم `Concurrent Rendering`، `Suspense`، RSC و APIهای جدید مثل `use()` و `<Activity>` هم به این خانواده تعلق دارند.

---

## چرا

مدل `declarative` React برای ساخت UI از `state` و `props` عالی است، اما:

- بعضی کارها (`focus`، `scroll`، `measure`) نیاز به DOM مستقیم دارند
- `side effect`ها (شبکه، `subscription`، `timer`) باید خارج از `render` مدیریت شوند
- `prop drilling` عمیق با `Context` حل می‌شود
- بارگذاری ناهمگام و رندر سنگین با `Suspense` و `Concurrent` قابل مدیریت‌اند

---

## چه مشکلی را حل می‌کند؟

- دسترسی `imperative` به DOM بدون شکستن مدل `declarative`
- `side effect` و `subscription` خارج از `render`
- `prop drilling` عمیق و `loading state` پراکنده
- `bundle` سنگین کلاینت و UX «یخ‌زده» هنگام رندر سنگین
- `hide`/`show` UI با حفظ `state` داخلی (بدون `unmount`)

---

## نقشه Escape Hatches

### کلاسیک (Core React — M2)

| مفهوم            | کاربرد                                | فایل                                         |
| ---------------- | ------------------------------------- | -------------------------------------------- |
| `ref`            | DOM، مقدار `mutable` بدون `re-render` | [Refs.md](../Refs.md)                         |
| `effect`         | `side effect` بعد از `render`         | [Effects.md](../Effects.md)                   |
| `Context`        | داده سراسری بدون `prop drilling`      | [Context.md](../Context.md)                   |
| `Portal`         | `render` خارج از والد DOM             | [Portals.md](../Portals.md)                   |
| `Custom Hook`    | منطق قابل استفاده مجدد                | [Custom-Hooks.md](../Custom-Hooks.md)         |
| `Error Boundary` | گرفتن خطای `render`                   | [Error-Boundaries.md](../Error-Boundaries.md) |

### مدرن (این ماژول — M5)

| مفهوم                  | کاربرد                                 | فایل                                               |
| ---------------------- | -------------------------------------- | -------------------------------------------------- |
| `Concurrent Rendering` | رندر قابل `interrupt`، اولویت‌بندی     | [Concurrent-Features.md](./Concurrent-Features.md) |
| `Suspense`             | `loading` `declarative`                | [Suspense.md](./Suspense.md)                       |
| `lazy`                 | بارگذاری تنبل کامپوننت                 | [Lazy-Loading.md](./Lazy-Loading.md)               |
| `Server Component`     | منطق و داده روی سرور                   | [Server-Components.md](./Server-Components.md)     |
| `Client Component`     | تعامل و `state` در مرورگر              | [Client-Components.md](./Client-Components.md)     |
| `React Compiler`       | `memoization` خودکار                   | [React-Compiler.md](./React-Compiler.md)           |
| `use()`                | خواندن `promise`/`context` در `render` | [Hooks/use.md](../Hooks/use.md)                     |

---

## `<Activity>` — React 19.2

برای `hide`/`show` کردن بخشی از UI بدون از دست دادن `state` داخلی، از `<Activity>` استفاده می‌شود.

```jsx
import { Activity } from "react";

<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>;
```

### تفاوت با `unmount`

| روش                        | `state` داخلی | `effect`ها                |
| -------------------------- | ------------- | ------------------------- |
| `{show && <Sidebar />}`    | از بین می‌رود | `cleanup` می‌شود          |
| `<Activity mode="hidden">` | حفظ می‌شود    | `destroy` و بعد `restore` |

وقتی `mode="hidden"` است:

- فرزندان با `display: none` مخفی می‌شوند
- `effect`ها `cleanup` می‌شوند (بدون `subscription` ناخواسته)
- `state` داخلی حفظ می‌ماند
- با `mode="visible"` دوباره نمایش داده می‌شوند

### چه زمانی

- `sidebar`/`tab`/`panel` که کاربر به‌زودی برمی‌گردد
- جایگزین `display: none` دستی برای `subtree`های سنگین با `state`

### چه زمانی نه

- وقتی واقعاً باید کامپوننت `unmount` شود (آزادسازی حافظه)
- محتوای فقط متنی بدون DOM (محدودیت API)

مثال کد: [Examples/escape-hatches/ActivityDemo.jsx](../Examples/escape-hatches/ActivityDemo.jsx)

---

## React 19 — خلاصه تغییرات مرتبط

این موارد در M2/M3 پوشش داده شده‌اند؛ اینجا فقط ارجاع:

- `ref` به‌عنوان `prop` معمولی — [Refs.md](../Refs.md)
- `ref callback` با `cleanup` — [Refs.md](../Refs.md)
- `Context` بدون `.Provider` — [Context.md](../Context.md)
- `use(Context)` شرطی — [Hooks/use.md](../Hooks/use.md)

---

## ترتیب مطالعه پیشنهادی

1. [Concurrent Features](./Concurrent-Features.md) — پایه رندر مدرن
2. [Suspense](./Suspense.md) + [Lazy Loading](./Lazy-Loading.md)
3. [Hooks/use.md](../Hooks/use.md) — `promise` و `context`
4. [Server Components](./Server-Components.md) + [Client Components](./Client-Components.md)
5. [React Compiler](./React-Compiler.md)

---

## ارتباط با مفاهیم دیگر

- [Hooks/useTransition](../Hooks/useTransition.md) · [Hooks/useDeferredValue](../Hooks/useDeferredValue.md)
- [Error Boundaries](../Error-Boundaries.md) — همراه `Suspense`
- [Performance/Render-Cycle.md](../Performance/Render-Cycle.md)
- [Next.js Overview](../Nextjs/README.md) — پیاده‌سازی RSC (M10)
- [Examples/escape-hatches/](../Examples/escape-hatches/) — `Suspense`، `use(promise)`، `<Activity>`

---

## خلاصه

راه رسمی React برای کار خارج از مدل `declarative`، «Escape Hatch» نام دارد. در React مدرن: `Concurrent` + `Suspense` + `lazy` برای UX واکنش‌گرا، RSC برای سرور، `use()` برای `promise`/`context`، و `<Activity>` برای `hide`/`show` با حفظ `state`.

---

## 📚 منابع

- [Escape Hatches — react.dev](https://react.dev/learn/escape-hatches)
- [Activity — react.dev](https://react.dev/reference/react/Activity)
- [use — react.dev](https://react.dev/reference/react/use)
- [Server Components — react.dev](https://react.dev/reference/rsc/server-components)
