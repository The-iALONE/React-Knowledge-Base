# State Management — نمای کلی

> 🧭 پیش‌نیاز: [State](../State.md) · [Context](../Context.md) · [انواع State](./State-Types.md) · بعدی: [Context API](./Context-API.md)

---

## 📖 مفهوم

راهنمای انتخاب و ترکیب ابزارهای مدیریت `state` در React — از `useState` محلی تا Redux و React Query.

مدیریت `state` (`State Management`) یعنی نگه‌داری، به‌روزرسانی و همگام‌سازی داده با UI. در اپ واقعی چند لایه داریم: `UI` موقت، `client state` سراسری، `server state` از API، و `form state`. هر کدام ابزار مخصوص خودش را دارد.

---

## چرا این ویژگی وجود دارد؟

وقتی اپ بزرگ می‌شود، `prop drilling`، `inconsistency` بین تب‌ها، و `race condition` در `fetch` دستی ظاهر می‌شود. بدون معماری روشن، هر توسعه‌دهنده یک روش متفاوت انتخاب می‌کند.

---

## چه مشکلی را حل می‌کند؟

- اشتراک داده بین کامپوننت‌های دور از هم
- `cache` و `refetch` دادهٔ API
- `debug` و پیش‌بینی‌پذیری به‌روزرسانی‌های پیچیده
- مدیریت فرم با `validation`

---

## ⚙️ نحوه کار — Taxonomy و ابزارها

### انواع `state` (خلاصه)

| نوع | ابزار معمول | فایل |
|-----|-------------|------|
| Local / UI | `useState`، `useReducer` | [State-Types](./State-Types.md) |
| Global / Client | Redux، Zustand، Context | زیر |
| Remote / Server / Cache | React Query، RTK Query | [React-Query](./React-Query.md) |
| Form | React Hook Form | [React-Hook-Form](./React-Hook-Form.md) |
| URL | React Router / Next.js | M8 / M10 |

جزئیات کامل: [State-Types.md](./State-Types.md)

### طیف ابزارها

```
محلی (یک کامپوننت)     → useState, useReducer
اشتراک در subtree       → Context API + useReducer
سراسری predictable     → Redux Toolkit, Zustand, Jotai, MobX, Recoil
داده سرور (remote)      → TanStack Query, RTK Query, SWR
فرم‌ها                  → React Hook Form (+ Zod)
```

---

## فهرست مستندات

| موضوع | فایل | بهترین برای |
|-------|------|-------------|
| انواع `state` | [State-Types](./State-Types.md) | تصمیم‌گیری قبل از ابزار |
| Context API | [Context-API](./Context-API.md) | `theme`، `auth`، دادهٔ کم‌تغییر |
| useReducer Pattern | [useReducer-Pattern](./useReducer-Pattern.md) | منطق پیچیده + اشتراک محلی |
| Redux (کلاسیک) | [Redux](./Redux.md) | درک تاریخچه و مفاهیم پایه |
| Redux Toolkit | [Redux-Toolkit](./Redux-Toolkit.md) | `global state` + RTK Query |
| Zustand | [Zustand](./Zustand.md) | store سبک بدون boilerplate |
| Jotai | [Jotai](./Jotai.md) | `atomic state`، وابستگی دقیق |
| MobX | [MobX](./MobX.md) | مدل واکنش‌گرا (`observable`) |
| Recoil | [Recoil](./Recoil.md) | atoms/selectors (Meta) |
| React Query | [React-Query](./React-Query.md) | `server state`، CRUD کابین |
| React Hook Form | [React-Hook-Form](./React-Hook-Form.md) | فرم با `validation` |

---

## مقایسه سریع ابزارهای Global

| معیار | Context | useReducer+Context | Redux Toolkit | Zustand | Jotai |
|-------|---------|-------------------|---------------|---------|-------|
| Setup | کم | متوسط | بیشتر | کم | کم |
| DevTools | محدود | محدود | عالی | خوب | محدود |
| Performance | ضعیف برای داده پرتغییر | متوسط | selector + memo | selector | atom دقیق |
| Async | useEffect | useEffect | thunk / RTK Query | middleware | atom async |
| یادگیری | آسان | متوسط | بیشتر | آسان | متوسط |

---

## درخت تصمیم‌گیری

```
فقط یک کامپوننت؟           → useState
چند کامپوننت نزدیک؟        → lift state یا Context سبک
logic چند action؟          → useReducer (+ Context اگر لازم)
global + debug + history؟  → Redux Toolkit
global سبک؟                → Zustand
داده API + cache؟          → TanStack Query (جدا از client state)
فرم؟                       → React Hook Form
```

---

## معماری پیشنهادی (پروژه متوسط — مثلاً Wild Oasis / use-cabins)

```text
Client state (cart, UI)       → Redux Toolkit یا Zustand
Server state (API data)       → TanStack Query
Forms                         → React Hook Form
Theme / locale                → Context (سبک)
Filters در URL                → searchParams
```

---

## مثال واقعی در پروژه

- **redux-intro / fast-react-pizza**: Redux Toolkit — `accountSlice`، `customerSlice`، thunk برای تبدیل ارز
- **use-cabins / Wild Oasis**: React Query — `useCabins`، `useCreateCabin`، `invalidateQueries`
- **atomic-blog**: Context API — `PostContext` برای اشتراک پست‌ها

مثال‌های کد: [Examples/state-management/](../Examples/state-management/)

---

## 🚀 Best Practices

✅ `server state` و `client state` را جدا نگه دارید  
✅ از React Query برای `cache` API استفاده کنید، نه Redux  
✅ `Context` فقط برای داده‌های کم‌تغییر  
✅ Redux Toolkit به‌جای Redux خام  
❌ همه چیز در یک `global store`  
❌ `fetch` دستی + `useEffect` برای هر `endpoint`

---

## ⚠️ اشتباهات رایج

❌ Redux برای دادهٔ API که React Query بهتر handle می‌کند  
❌ Context با `value={{ user, cart, theme }}` — هر تغییر همه را `re-render` می‌کند  
❌ انتخاب ابزار قبل از تشخیص نوع `state`

---

## ارتباط با مفاهیم دیگر

- [State](../State.md) · [Context](../Context.md) · [Sharing State](../Sharing-State.md)
- [Hooks/useReducer](../Hooks/useReducer.md) · [Hooks/useContext](../Hooks/useContext.md)
- [Performance/State-Colocation](../Performance/State-Colocation.md)
- [Patterns/Reusability Patterns](../Patterns/Reusability-Patterns.md)

---

## خلاصه

اول [نوع `state`](./State-Types.md) را تشخیص بده؛ محلی → Hooks؛ اشتراک سبک → Context؛ سراسری → RTK/Zustand؛ API → React Query؛ فرم → RHF.

---

## 📚 منابع

- [Managing State — react.dev](https://react.dev/learn/managing-state)
- [Choosing the State Structure — react.dev](https://react.dev/learn/choosing-the-state-structure)
- [Redux Toolkit](https://redux-toolkit.js.org) · [TanStack Query](https://tanstack.com/query)
