# React APIs — مرجع پکیج `react`

> 🧭 پیش‌نیاز: [Backend Integration (Supabase)](./Nextjs/Backend-Integration-Supabase.md) · بعدی: [React DOM APIs](./React-DOM-APIs.md)

نقشهٔ APIهای پکیج `react` — راهنمای سریع با لینک به فایل‌های عمیق‌تر در همین مخزن.

---

## 📖 مفهوم

پکیج `react` علاوه بر `Hook`ها و کامپوننت‌های داخلی، APIهای سطح پایین برای ساخت element، بهینه‌سازی رندر، `Context`، بارگذاری تنبل و `Transition` صادر می‌کند. این فایل **فهرست راهنما** است — نه جایگزین [react.dev/reference/react](https://react.dev/reference/react).

برای هر API، ابتدا فایل موضوعی مرتبط در این مخزن را بخوانید؛ جزئیات رسمی را از react.dev بگیرید.

---

## چرا این ویژگی وجود دارد؟

وقتی در مصاحبه یا کد واقعی نام `memo`، `lazy` یا `startTransition` می‌آید، باید بدانید کدام لایهٔ React است و با کدام `Hook` یا الگو جفت می‌شود — بدون گشتن در کل مستندات.

---

## چه مشکلی را حل می‌کند؟

- گم شدن بین APIهای `react` و `react-dom`
- استفادهٔ اشتباه از API سطح پایین وقتی `Hook` یا الگوی موجود کافی است
- نادیده گرفتن APIهای جدید React 19 (`use`، Actions)

---

## ⚙️ نحوه کار — نقشه APIها

### ۱. ساخت element و نوع کامپوننت

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `createElement` | ساخت element بدون JSX | [JSX](./JSX.md) |
| `Fragment` / `<>...</>` | گروه‌بندی بدون DOM اضافه | [Components](./Components.md) |
| `StrictMode` | تشخیص باگ در dev (double invoke) | [Lifecycle](./Lifecycle.md) |
| `Suspense` | نمایش fallback هنگام انتظار | [Escape-Hatches/Suspense](./Escape-Hatches/Suspense.md) |
| `Activity` | نگه‌داشتن UI پنهان بدون unmount | [Escape-Hatches/README](./Escape-Hatches/README.md) |

### ۲. کامپوننت‌های کلاس (Legacy)

| API | وضعیت | توجه |
|-----|--------|------|
| `Component` | Legacy | ترجیح: کامپوننت تابعی + `Hook`ها |
| `PureComponent` | Legacy | معادل تقریبی `memo` در کلاس |
| `forwardRef` | هنوز رایج | در React 19 `ref` می‌تواند prop باشد — [Refs](./Refs.md) |

جزئیات مهاجرت: [Migration-Notes](./Migration-Notes.md).

### ۳. Context

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `createContext` | تعریف `Context` | [Context](./Context.md)، [Context-API](./State-Management/Context-API.md) |
| `use(context)` | خواندن `Context` در شرط/حلقه (React 19) | [Hooks/use](./Hooks/use.md) |

در React 19 می‌توان `<ThemeContext value={theme}>` نوشت — بدون `.Provider`.

### ۴. بهینه‌سازی و بارگذاری

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `memo` | skip رندر با `props` برابر | [Patterns/React-Memo](./Patterns/React-Memo.md)، [Memoization](./Performance/Memoization.md) |
| `lazy` | `code splitting` — بارگذاری تنبل | [Escape-Hatches/Lazy-Loading](./Escape-Hatches/Lazy-Loading.md) |
| `cache` | cache تابع async در RSC | [Escape-Hatches/Server-Components](./Escape-Hatches/Server-Components.md) |

با **React Compiler**، نیاز به `memo` دستی در بسیاری پروژه‌ها کمتر می‌شود — [React-Compiler](./Escape-Hatches/React-Compiler.md).

### ۵. Concurrent و اولویت‌بندی

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `startTransition` | علامت‌گذاری به‌روزرسانی غیرفوری (خارج کامپوننت هم) | [Concurrent-Features](./Escape-Hatches/Concurrent-Features.md) |
| `useTransition` | همان + `isPending` | [useTransition](./Hooks/useTransition.md) |
| `useDeferredValue` | defer مقدار برای UI واکنش‌گرا | [useDeferredValue](./Hooks/useDeferredValue.md) |

### ۶. Resource API (React 19)

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `use(promise)` | خواندن نتیجهٔ `promise` در `render` + Suspense | [Hooks/use](./Hooks/use.md) |
| `use(context)` | خواندن `Context` انعطاف‌پذیر | [Hooks/use](./Hooks/use.md) |

### ۷. فرم و mutation (React 19)

| API | کاربرد | فایل در مخزن |
|-----|--------|--------------|
| `useActionState` | `state` فرم از Server/Client Action | [useActionState](./Hooks/useActionState.md) |
| `useFormStatus` | وضعیت ارسال فرم از والد | [useFormStatus](./Hooks/useFormStatus.md) |
| `useOptimistic` | UI خوش‌بینانه قبل از پاسخ سرور | [useOptimistic](./Hooks/useOptimistic.md) |

### ۸. تست

| API | کاربرد |
|-----|--------|
| `act` | wrap رندر/تعامل در تست تا assertion بعد از commit باشد |

### ۹. `Hook`ها — فهرست کامل

همهٔ `Hook`ها در [Hooks/README.md](./Hooks/README.md) با ترتیب یادگیری و لینک react.dev.

| دسته | نمونه |
|------|--------|
| State | `useState`, `useReducer`, `useOptimistic`, `useActionState` |
| Effect | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` |
| Performance | `useMemo`, `useCallback`, `useDeferredValue`, `useTransition` |
| Ref / DOM | `useRef`, `useImperativeHandle`, `useId` |
| External | `useSyncExternalStore`, `useContext` |
| Forms | `useFormStatus` |

---

## تفاوت با `react-dom`

| پکیج | مسئولیت |
|------|---------|
| `react` | تعریف کامپوننت، `Hook`، element، الگوهای منطقی |
| `react-dom` | mount به DOM، `Portal`، `hydrate`، APIهای سرور | [React-DOM-APIs](./React-DOM-APIs.md) |

---

## مثال واقعی در پروژه

در Wild Oasis، لیست کابین با `lazy` + `Suspense` بارگذاری می‌شود؛ دکمهٔ مرتب‌سازی با `startTransition` UI را block نمی‌کند؛ `memo` روی `CabinRow` فقط وقتی `props` سنگین است — الگوها در [Patterns](./Patterns/README.md) و [Performance](./Performance/README.md).

---

## 🚀 Best Practices

✅ قبل از `memo`/`lazy`، ساختار درست کامپوننت و `state` colocation — [Best-Practices](./Best-Practices.md)  
✅ API سطح پایین (`createElement`) فقط وقتی JSX در دسترس نیست  
✅ `lazy` همیشه با `Suspense` و تعریف خارج از کامپوننت  
✅ `startTransition` برای به‌روزرسانی‌های غیرفوری UI (فیلتر، تب، جستجو)  
✅ برای API جدید React 19 ابتدا [WhatsNew](./WhatsNew.md) را ببینید

---

## ⚠️ اشتباهات رایج

❌ import همهٔ APIها از `react-dom` به‌جای `react`  
❌ `memo` روی هر کامپوننت بدون اندازه‌گیری — [Profiler](./Performance/Profiling.md)  
❌ `lazy` داخل بدنهٔ کامپوننت (هر رندر factory جدید)  
❌ `use(promise)` بدون `Suspense` boundary  
❌ نادیده گرفتن Compiler و نگه‌داشتن `memo`/`useMemo` اضافی

---

## ارتباط با مفاهیم دیگر

- [React-DOM-APIs](./React-DOM-APIs.md) — mount، portal، hydrate
- [Hooks/README](./Hooks/README.md) — همهٔ Hookها
- [Patterns/README](./Patterns/README.md) — `memo`، compound، HOC
- [Escape-Hatches/README](./Escape-Hatches/README.md) — Suspense، lazy، RSC
- [Migration-Notes](./Migration-Notes.md) — کلاس و نسخه‌ها
- [Cheatsheet](./Cheatsheet.md) — مرور فشرده

---

## خلاصه

پکیج `react` APIهای element، Context، بهینه‌سازی (`memo`/`lazy`)، Concurrent (`startTransition`) و Resource (`use`) را فراهم می‌کند. برای جزئیات هر API به فایل موضوعی مخزن و react.dev بروید؛ mount و DOM در `react-dom` است.

---

## 📚 منابع

- [React Reference — react.dev](https://react.dev/reference/react)
- [Built-in React APIs — react.dev](https://react.dev/reference/react/apis)
- [React Components — react.dev](https://react.dev/reference/react/components)
- [React Hooks — react.dev](https://react.dev/reference/react/hooks)
