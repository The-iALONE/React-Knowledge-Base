# WhatsNew — مفاهیم جدید (غیرجزوه)

> فهرست مفاهیم و APIهایی که در جزوه قدیمی نبودند و از [react.dev](https://react.dev) به این پروژه اضافه شده‌اند. برای مرور سریع «چه چیزهایی جدید است».

---

## 📖 مفهوم

این فایل نقشه راه مفاهیم **جدید نسبت به جزوه** است — نه changelog فنی پروژه (آن در [ROADMAP.md](./ROADMAP.md) است). هر ردیف لینک مستقیم به فایل مستندات دارد.

---

## M11 — Reference (ضمیمه)

| مفهوم | فایل | خلاصه |
|-------|------|--------|
| نقشه API `react` | [React-APIs.md](./React-APIs.md) | memo، lazy، `use`، Context — لینک به Hooks/Patterns |
| نقشه API `react-dom` | [React-DOM-APIs.md](./React-DOM-APIs.md) | createRoot، Portal، flushSync، server |
| عادت‌های عمومی | [Best-Practices.md](./Best-Practices.md) | جدا از Performance/Best-Practices |
| اشتباهات عمومی | [Common-Pitfalls.md](./Common-Pitfalls.md) | mutate، deps، key — جدا از Performance |
| پرسش پرتکرار | [FAQ.md](./FAQ.md) | ۲۱ سؤال با لینک عمیق |
| مصاحبه | [Interview-Questions.md](./Interview-Questions.md) | هاب + لینک Interview در Hooks |
| مهاجرت | [Migration-Notes.md](./Migration-Notes.md) | Class→Hooks، 17→18→19، App Router |

---

## M8 — React Router (ماژول جدید)

| مفهوم | فایل | خلاصه |
|-------|------|--------|
| نمای کلی M8 | [React-Router/README.md](./React-Router/README.md) | هاب ماژول ۰۹ — `BrowserRouter` vs data router |
| Protected Routes | [Navigation.md](./React-Router/Navigation.md) | `ProtectedRoute` + `useUser` — SPA (جدا از Next middleware) |
| `createBrowserRouter` | [README.md](./React-Router/README.md) | data router 6.4+ — `loader`/`action` |

### مثال‌های کد M8

| فایل | موضوع |
|------|--------|
| [NestedRoutes.jsx](./Examples/react-router/NestedRoutes.jsx) | layout + `Outlet` |
| [DynamicRoutes.jsx](./Examples/react-router/DynamicRoutes.jsx) | `:cityId` + `useParams` |
| [UrlSearchParams.jsx](./Examples/react-router/UrlSearchParams.jsx) | فیلتر/مرتب‌سازی Wild Oasis |
| [ProtectedRoute.jsx](./Examples/react-router/ProtectedRoute.jsx) | guard مسیر خصوصی |

---

## M7 — State Management (جدید + غنی‌سازی غیرجزوه)

| مفهوم | نسخه | فایل | خلاصه |
|-------|------|------|--------|
| Taxonomy ۱۱ نوع `state` | — | [State-Types.md](./State-Management/State-Types.md) | Local تا Cache — پایه انتخاب ابزار |
| Zustand | — | [Zustand.md](./State-Management/Zustand.md) | global store سبک بدون Provider |
| Jotai | — | [Jotai.md](./State-Management/Jotai.md) | atomic state + derived atom |
| MobX | — | [MobX.md](./State-Management/MobX.md) | observable + observer |
| Recoil | — | [Recoil.md](./State-Management/Recoil.md) | atoms/selectors (Meta) |
| RTK Query | RTK 2+ | [Redux-Toolkit.md](./State-Management/Redux-Toolkit.md) | `server state` در اکوسیستم Redux |
| نمای کلی M7 | — | [State-Management/README.md](./State-Management/README.md) | هاب ماژول ۰۸ |

### مثال‌های کد M7

| فایل | موضوع |
|------|--------|
| [ContextReducerCombo.jsx](./Examples/state-management/ContextReducerCombo.jsx) | Context + useReducer |
| [ZustandStore.jsx](./Examples/state-management/ZustandStore.jsx) | Zustand cart |
| [ReduxSlice.js](./Examples/state-management/ReduxSlice.js) | RTK accountSlice |
| [useCabinsQuery.jsx](./Examples/state-management/useCabinsQuery.jsx) | React Query custom hook |
| [CabinForm.jsx](./Examples/state-management/CabinForm.jsx) | React Hook Form |

---

## M6 — Performance (ماژول جدید + react.dev)

| مفهوم | نسخه React | فایل | خلاصه |
|-------|------------|------|--------|
| نمای کلی Performance | — | [Performance/README.md](./Performance/README.md) | هاب ماژول ۰۷ — Virtual DOM تا profiling |
| `<Profiler>` API | 16+ | [Profiling.md](./Performance/Profiling.md) | اندازه‌گیری programmatic رندر |
| `React Compiler` در بهینه‌سازی | 19+ | [Optimization-Techniques.md](./Performance/Optimization-Techniques.md) | جایگزینی `memo` دستی |
| `children-as-prop` optimization | — | [Memoization.md](./Performance/Memoization.md) | جدا کردن `state` از subtree سنگین |

### مثال‌های کد M6

| فایل | موضوع |
|------|--------|
| [MemoizedList.jsx](./Examples/performance/MemoizedList.jsx) | `memo` + `useMemo` + `useCallback` |
| [ChildrenOptimization.jsx](./Examples/performance/ChildrenOptimization.jsx) | الگوی `children` |
| [StateColocation.jsx](./Examples/performance/StateColocation.jsx) | colocation جستجو |

---

## M5 — Escape Hatches و React مدرن (جدید)

| مفهوم | نسخه React | فایل | خلاصه |
|-------|------------|------|--------|
| `use(promise)` | 19 | [Hooks/use.md](./Hooks/use.md) | خواندن `promise` در `render` + Suspense |
| `use(context)` | 19 | [Hooks/use.md](./Hooks/use.md) | خواندن `context` داخل `if`/`for` |
| `<Activity>` | 19.2 | [Escape-Hatches/README.md](./Escape-Hatches/README.md) | `hide`/`show` UI با حفظ `state` |
| `Concurrent Rendering` | 18+ | [Concurrent-Features.md](./Escape-Hatches/Concurrent-Features.md) | رندر قابل `interrupt` |
| `Suspense` (جامع) | 18+ | [Suspense.md](./Escape-Hatches/Suspense.md) | `fallback` `declarative` |
| `React.lazy` (جامع) | 18+ | [Lazy-Loading.md](./Escape-Hatches/Lazy-Loading.md) | `code splitting` کامپوننت |
| `Server Components` (RSC) | 18+ / فریم‌ورک | [Server-Components.md](./Escape-Hatches/Server-Components.md) | اجرا روی سرور، بدون `bundle` کلاینت |
| `Client Components` | 18+ / فریم‌ورک | [Client-Components.md](./Escape-Hatches/Client-Components.md) | `'use client'` برای تعامل |
| `React Compiler` | 19+ | [React-Compiler.md](./Escape-Hatches/React-Compiler.md) | `memoization` خودکار در build |
| نمای کلی Escape Hatches | — | [Escape-Hatches/README.md](./Escape-Hatches/README.md) | هاب ماژول ۰۵ |

### مثال‌های کد M5

| فایل | موضوع |
|------|--------|
| [SuspenseLazy.jsx](./Examples/escape-hatches/SuspenseLazy.jsx) | `lazy` + Suspense |
| [UsePromise.jsx](./Examples/escape-hatches/UsePromise.jsx) | `use(promise)` |
| [ActivityDemo.jsx](./Examples/escape-hatches/ActivityDemo.jsx) | `<Activity>` |

---

## M3 — Hooks (اضافه‌شده از react.dev)

| مفهوم | نسخه React | فایل | خلاصه |
|-------|------------|------|--------|
| `useEffectEvent` | 19.2 | [Hooks/useEffectEvent.md](./Hooks/useEffectEvent.md) | رویداد `non-reactive` داخل `Effect` |
| `useInsertionEffect` | 18 | [Hooks/useInsertionEffect.md](./Hooks/useInsertionEffect.md) | `inject` CSS قبل از `layout` |
| `useOptimistic` | 19 | [Hooks/useOptimistic.md](./Hooks/useOptimistic.md) | UI خوش‌بینانه |
| `useActionState` | 19 | [Hooks/useActionState.md](./Hooks/useActionState.md) | `state` فرم + Server Action |
| `useFormStatus` | 19 | [Hooks/useFormStatus.md](./Hooks/useFormStatus.md) | وضعیت `submit` از فرزند |
| `useTransition` | 18 | [Hooks/useTransition.md](./Hooks/useTransition.md) | `update` غیرفوری |
| `useDeferredValue` | 18 | [Hooks/useDeferredValue.md](./Hooks/useDeferredValue.md) | `defer` مقدار نمایشی |
| `useSyncExternalStore` | 18 | [Hooks/useSyncExternalStore.md](./Hooks/useSyncExternalStore.md) | `subscribe` به store خارجی |
| `useId` (prefix 19.2) | 19.2 | [Hooks/useId.md](./Hooks/useId.md) | ID یکتا با پیشوند قابل تنظیم |
| `useDebugValue` | — | [Hooks/useDebugValue.md](./Hooks/useDebugValue.md) | برچسب در DevTools |

---

## M2 — Core React (به‌روزرسانی React 19)

| مفهوم | نسخه React | فایل | خلاصه |
|-------|------------|------|--------|
| `ref` به‌عنوان `prop` | 19 | [Refs.md](./Refs.md) | بدون `forwardRef` در کد جدید |
| `ref callback` با `cleanup` | 19 | [Refs.md](./Refs.md) | تابع `cleanup` به‌جای `null` در unmount |
| `Context` بدون `.Provider` | 19 | [Context.md](./Context.md) | `<ThemeContext value={}>` |
| Form Actions | 19 | [Forms.md](./Forms.md) | `action` روی `<form>` |
| `useDeferredValue(initialValue)` | 19 | [Hooks/useDeferredValue.md](./Hooks/useDeferredValue.md) | امضای جدید API |

---

## M4 — Patterns (غنی‌سازی از react.dev)

| مفهوم | نسخه React | فایل | خلاصه |
|-------|------------|------|--------|
| `React Compiler` در `memo` | 19+ | [Patterns/React-Memo.md](./Patterns/React-Memo.md) | جایگزینی `memo` دستی |
| `Object.is` در مقایسه `props` | — | [Patterns/React-Memo.md](./Patterns/React-Memo.md) | جزئیات `shallow compare` |

---

## M10 — Next.js (تکمیل ۲۰۲۶-۰۸-۰۷)

| مفهوم | نسخه | فایل | خلاصه |
|-------|------|------|--------|
| `cacheSignal` | 19.2 | [Nextjs/Server-Components.md](./Nextjs/Server-Components.md) | abort-aware cache در RSC |
| `prerender` / `resume` | 19+ | [Nextjs/Server-Components.md](./Nextjs/Server-Components.md) · [Streaming-And-Suspense.md](./Nextjs/Streaming-And-Suspense.md) | `react-dom/static` |
| RSC در App Router | — | [Nextjs/Server-Components.md](./Nextjs/Server-Components.md) | زاویه Next.js جدا از M5 |
| `params` as `Promise` | 15+ | [Nextjs/Routing-And-Pages.md](./Nextjs/Routing-And-Pages.md) | `await params` در page |
| Auth.js v5 | — | [Nextjs/Authentication-NextAuth.md](./Nextjs/Authentication-NextAuth.md) | `auth()` + handlers |

---

## چگونه از این فایل استفاده کنید

1. **فقط M10:** بخش M10 — ۱۸ فایل `Nextjs/` + مثال‌ها
2. **فقط M7:** بخش M7 — State Management + مثال‌ها
3. **فقط M6:** بخش M6 — ماژول Performance + مثال‌ها
4. **فقط M5:** بخش M5 — ۷ فایل + `use()` + مثال‌ها
5. **همه چیز جدید:** از بالا به پایین — M10 → M7 → M6 → M5 → M3 → M2 → M4
6. **مسیر یادگیری:** [Learning-Path.md](./Learning-Path.md) ماژول ۱۱ (Next.js)

---

## منابع

- [ROADMAP.md](./ROADMAP.md) — پیشرفت milestoneها
- [React Documentation](https://react.dev)
