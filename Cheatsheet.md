# Cheatsheet — مرور فشرده React

> برای مرور چندثانیه‌ای. جزئیات در فایل‌های مربوطه.

---

## `Hook`های اصلی

| Hook | یک‌خط یادآوری | فایل |
|------|---------------|------|
| `useState` | `state` محلی کامپوننت | [useState](./Hooks/useState.md) |
| `useEffect` | `side effect` بعد از `render` | [useEffect](./Hooks/useEffect.md) |
| `useRef` | مقدار پایدار بدون `re-render` | [useRef](./Hooks/useRef.md) |
| `useContext` | خواندن `Context` | [useContext](./Hooks/useContext.md) |
| `useReducer` | `state` پیچیده با `reducer` | [useReducer](./Hooks/useReducer.md) |
| `useMemo` | `cache` نتیجه محاسبه | [useMemo](./Hooks/useMemo.md) |
| `useCallback` | `cache` تابع | [useCallback](./Hooks/useCallback.md) |
| `useTransition` | به‌روزرسانی `non-urgent` با `loading` | [useTransition](./Hooks/useTransition.md) |
| `useDeferredValue` | `defer` مقدار برای UI واکنش‌گرا | [useDeferredValue](./Hooks/useDeferredValue.md) |
| `useOptimistic` | UI خوش‌بینانه قبل از پاسخ سرور | [useOptimistic](./Hooks/useOptimistic.md) |
| `useActionState` | `state` فرم + `Server Action` | [useActionState](./Hooks/useActionState.md) |
| `useFormStatus` | وضعیت ارسال فرم (از `child`) | [useFormStatus](./Hooks/useFormStatus.md) |
| `use` | خواندن `promise`/`context` در `render` | [use](./Hooks/use.md) |

---

## Rules of Hooks

1. فقط در **top level** فراخوانی شوند (نه داخل `if`/`loop`)
2. فقط از **کامپوننت React** یا **Custom Hook** فراخوانی شوند

---

## Performance سریع

| تکنیک | چه زمانی | فایل |
|-------|----------|------|
| Profiler | قبل از هر بهینه‌سازی | [Profiling](./Performance/Profiling.md) |
| `state colocation` | `state` را پایین‌تر ببرید | [State-Colocation](./Performance/State-Colocation.md) |
| `key` پایدار | لیست‌ها — نه `index` برای reorder | [Keys](./Performance/Keys-And-Performance.md) |
| `children` pattern | فرزند سنگین جدا از `state` والد | [Memoization](./Performance/Memoization.md) |
| `React.memo` | فرزند `pure` با `props` کم‌تغییر | [React-Memo](./Patterns/React-Memo.md) |
| `useMemo` | محاسبه گران، `dependency` کم‌تغییر | [useMemo](./Hooks/useMemo.md) |
| `useCallback` | تابع به فرزند `memoized` | [useCallback](./Hooks/useCallback.md) |
| `lazy` + `Suspense` | `route`/`component` سنگین | [Code-Splitting](./Performance/Code-Splitting.md) |
| React Compiler | جایگزین بسیاری از memo دستی | [React-Compiler](./Escape-Hatches/React-Compiler.md) |
| `<Suspense>` + `use(promise)` | داده ناهمگام `declarative` | [use](./Hooks/use.md) |
| `<Activity mode="hidden">` | `hide` UI با حفظ `state` | [Escape-Hatches](./Escape-Hatches/README.md) |

مرجع کامل: [Performance/README](./Performance/README.md) · [Optimization-Techniques](./Performance/Optimization-Techniques.md)

---

## State Management سریع

| نیاز | ابزار | فایل |
|------|-------|------|
| تشخیص نوع `state` | Taxonomy | [State-Types](./State-Management/State-Types.md) |
| محلی ساده | `useState` | [State](./State.md) |
| اشتراک سبک | Context | [Context-API](./State-Management/Context-API.md) |
| logic چند action | `useReducer` | [useReducer-Pattern](./State-Management/useReducer-Pattern.md) |
| global + DevTools | Redux Toolkit | [Redux-Toolkit](./State-Management/Redux-Toolkit.md) |
| global سبک | Zustand | [Zustand](./State-Management/Zustand.md) |
| atomic | Jotai | [Jotai](./State-Management/Jotai.md) |
| reactive OOP | MobX | [MobX](./State-Management/MobX.md) |
| API + cache | TanStack Query | [React-Query](./State-Management/React-Query.md) |
| فرم | React Hook Form | [React-Hook-Form](./State-Management/React-Hook-Form.md) |

مرجع کامل: [State-Management/README](./State-Management/README.md)

---

## React Router سریع

| API | یک‌خط یادآوری | فایل |
|-----|---------------|------|
| `BrowserRouter` | context مسیریابی در root | [Routing-Basics](./React-Router/Routing-Basics.md) |
| `Routes` / `Route` | نگاشت path → `element` | [Routing-Basics](./React-Router/Routing-Basics.md) |
| `Outlet` | render فرزند در layout | [Nested-Routes](./React-Router/Nested-Routes.md) |
| `useParams` | خواندن `:param` از URL | [Dynamic-Routes](./React-Router/Dynamic-Routes.md) |
| `Link` / `NavLink` | ناوبری بدون reload | [Navigation](./React-Router/Navigation.md) |
| `useNavigate` | ناوبری programmatic | [Navigation](./React-Router/Navigation.md) |
| `useSearchParams` | query string (`?sort=`) | [State-In-URL](./React-Router/State-In-URL.md) |
| `ProtectedRoute` | guard مسیر خصوصی SPA | [Navigation](./React-Router/Navigation.md) |

مرجع کامل: [React-Router/README](./React-Router/README.md)

---

## Rendering Flow

```
Trigger → Render Phase → Commit Phase → Browser Paint
```

---

## JSX سریع

```jsx
// شرطی
{isLoggedIn ? <Dashboard /> : <Login />}

// لیست
{items.map(item => <Item key={item.id} {...item} />)}

// event
<button onClick={() => setCount(c => c + 1)}>+</button>
```

---

## Next.js سریع

| مفهوم | فایل |
|-------|------|
| `"use client"` | [Client Components](./Escape-Hatches/Client-Components.md) |
| کامپوننت سرور (پیش‌فرض) | [Server Components](./Escape-Hatches/Server-Components.md) |
| `loading.js` | [Loading States](./Nextjs/Loading-And-Error-States.md) |
| `Server Actions` | [Server Actions](./Nextjs/Server-Actions.md) |
