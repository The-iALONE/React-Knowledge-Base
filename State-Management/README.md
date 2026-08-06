# State Management — نمای کلی

راهنمای انتخاب و ترکیب ابزارهای مدیریت `state` در React.

---
## 📖 مفهوم

مدیریت `state` (`State Management`) یعنی نگه‌داری، به‌روزرسانی و همگام‌سازی داده با UI. در React از `useState` محلی تا Redux و React Query طیف وسیعی وجود دارد.

---
## چرا این ویژگی وجود دارد؟

اپلیکیشن‌های واقعی `state` در سطوح مختلف دارند: فرم، UI موقت، `session` کاربر، داده سرور.

---
## چه مشکلی را حل می‌کند؟

`prop drilling`، `inconsistency`، `race condition` در `fetch`، و پیچیدگی به‌روزرسانی `state` تو در تو.

---
## ⚙️ نحوه کار — طیف ابزارها

```
محلی (کامپوننت)     → useState, useReducer
اشتراک در درخت      → Context API
سراسری predictable → Redux / Redux Toolkit
داده سرور (remote)  → React Query / TanStack Query
فرم‌ها              → React Hook Form (+ Zod)
```

---
## مقایسه: Context vs useReducer vs Redux

| معیار | useState | useReducer + Context | Redux Toolkit |
|-------|----------|----------------------|---------------|
| **پیچیدگی setup** | کم | متوسط | بیشتر (store, slice) |
| **بهترین برای** | `state` محلی ساده | `state` مشترک متوسط در `subtree` | `state` سراسری پیچیده |
| **پیش‌بینی‌پذیری** | متوسط | متوسط | بالا (`actions`, `reducers`) |
| `DevTools` | محدود | محدود | Redux DevTools |
| `Performance` | عالی (محلی) | `re-render` همه `consumer`ها | `selector` + `memoization` |
| **Async / side effects** | useEffect | useEffect | createAsyncThunk, RTK Query |
| **یادگیری** | آسان | متوسط | بیشتر |

### قانون عملی انتخاب

1. **فقط یک کامپوننت** → `useState`
2. **چند کامپوننت نزدیک، `logic` ساده** → `lift state` یا `Context` سبک
3. **`logic` پیچیده با چند `action`** → `useReducer` (محلی یا + `Context`)
4. `state` سراسری، چند `feature`، تاریخچه `debug` → `Redux Toolkit`
5. داده از API (`cache`, `stale`, `refetch`) → `React Query` (جدا از `client state`)
6. فرم با `validation` → `React Hook Form`

> `Context` جایگزین Redux نیست برای `state` بزرگ؛ برای `theme`، `auth user`، `locale` مناسب است.

---
## چه زمانی از کدام استفاده کنیم؟

| نیاز | ابزار |
|------|-------|
| `toggle`، `input` محلی | useState |
| `wizard` چندمرحله‌ای در یک `feature` | useReducer |
| `theme` / `language` | Context |
| سبد خرید سراسری | Redux Toolkit |
| لیست کابین از API | React Query |
| فرم رزرو با `validation` | React Hook Form |

---
## فهرست مستندات

| موضوع | فایل |
|-------|------|
| Context API | [Context-API.md](./Context-API.md) |
| useReducer Pattern | [useReducer-Pattern.md](./useReducer-Pattern.md) |
| Redux (کلاسیک) | [Redux.md](./Redux.md) |
| Redux Toolkit | [Redux-Toolkit.md](./Redux-Toolkit.md) |
| React Query | [React-Query.md](./React-Query.md) |
| React Hook Form | [React-Hook-Form.md](./React-Hook-Form.md) |

---
## 💡 معماری پیشنهادی (پروژه متوسط)

```text
Client state (UI, cart)     → Redux Toolkit
Server state (API data)     → TanStack Query
Forms                       → React Hook Form
Theme / Auth context        → Context (سبک)
```

---
## مثال واقعی در پروژه

- **fast-react-pizza**: Redux Toolkit برای cart + React Query برای menu (در نسخه‌های مدرن)
- **worldwise**: React Query برای cities + URL `state` برای فیلتر
- **use-cabins**: React Query CRUD کامل با `optimistic updates`

---
## 🚀 Best Practices

✅ `server state` و `client state` را جدا نگه دارید  
✅ از React Query برای `cache` API استفاده کنید، نه Redux  
✅ `Context` فقط برای داده‌های کم‌تغییر  
✅ Redux Toolkit به‌جای Redux خام  
❌ همه چیز در یک `global store`  
❌ `fetch` دستی + `useEffect` برای هر `endpoint`

---
## ارتباط با مفاهیم دیگر

- [State](../State.md) · [Context](../Context.md)
- [useReducer](../Hooks/useReducer.md) · [useContext](../Hooks/useContext.md)
- [Sharing State](../Sharing-State.md) · [Lifting State Up](../Lifting-State-Up.md)
- [Patterns/Reusability Patterns](../Patterns/Reusability-Patterns.md)

---
## خلاصه

`state` محلی → Hooks؛ اشتراک سبک → `Context`؛ سراسری پیچیده → RTK؛ داده سرور → React Query؛ فرم → RHF.

---
## 📚 منابع

- [Choosing the State Structure — react.dev](https://react.dev/learn/choosing-the-state-structure)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TanStack Query](https://tanstack.com/query)
