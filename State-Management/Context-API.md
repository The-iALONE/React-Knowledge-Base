# Context API

> 🧭 پیش‌نیاز: [Context](../Context.md) · [State-Types](./State-Types.md) · بعدی: [useReducer Pattern](./useReducer-Pattern.md)

---

## 📖 مفهوم

با Context API می‌توان داده را در درخت کامپوننت‌ها **بدون `prop drilling`** به اشتراک گذاشت. یک `Provider` مقدار را می‌دهد و هر فرزند با `useContext` می‌خواند — مثل پاس دادن `props`، ولی از هر عمقی.

در React 19 می‌توان مستقیماً `<ThemeContext value={theme}>` نوشت (بدون `.Provider`).

---

## چرا این ویژگی وجود دارد؟

وقتی ده‌ها کامپوننت میانی بین منبع داده و مصرف‌کننده باشد، پاس دادن `props` در هر لایه خسته‌کننده و شکننده است. Context این لایه‌های میانی را حذف می‌کند.

---

## چه مشکلی را حل می‌کند؟

- `prop drilling`
- اشتراک `theme`، `locale`، کاربر احراز هویت‌شده
- الگوی «mini store» وقتی با `useReducer` ترکیب شود

---

## ⚙️ نحوه کار

### ۱. ایجاد Context

```jsx
import { createContext, useState } from "react";

const SearchContext = createContext();

export default SearchContext;
```

نام با حرف بزرگ (مثل `PostContext`، `SearchContext`) — چون در JSX استفاده می‌شود.

### ۲. Provider

```jsx
function App() {
  const [search, setSearch] = useState("");

  return (
    <SearchContext value={{ search, setSearch }}>
      <Dashboard />
    </SearchContext>
  );
}
```

در نسخه ۱۹: `<SearchContext value={...}>` — در نسخه‌های قدیمی‌تر: `<SearchContext.Provider value={...}>`.

### ۳. مصرف با useContext

```jsx
import { useContext } from "react";
import SearchContext from "./SearchContext";

function SearchBar() {
  const { search, setSearch } = useContext(SearchContext);

  return (
    <input value={search} onChange={(e) => setSearch(e.target.value)} />
  );
}
```

---

## تفاوت با گزینه‌های مشابه

| ابزار | کی بهتر است |
|-------|-------------|
| **lift state** | فقط ۲–۳ سطح عمق |
| **Context** | `subtree` بزرگ، داده کم‌تغییر (`theme`) |
| **Redux / Zustand** | `state` سراسری پرتغییر، DevTools، middleware |
| **React Query** | داده از API — نه `client state` |

---

## مثال واقعی در پروژه

**atomic-blog**: `PostContext` — `posts`، `dispatch` برای افزودن/حذف پست در کل اپ بدون پاس دادن `props` از `App` به هر صفحه.

---

## 🚀 Best Practices

✅ Context جدا برای هر concern (`ThemeContext`، `AuthContext`)  
✅ `value` را با `useMemo` پایدار کنید اگر `object` جدید در هر `render` می‌سازید  
✅ Custom Hook بسازید: `useSearch()` به‌جای `useContext(SearchContext)` در همه جا  
❌ یک Context غول‌پیکر با همهٔ `state` اپ  
❌ Context برای دادهٔ پرتغییر (لیست ۱۰۰۰ تایی)

---

## ⚠️ اشتباهات رایج

❌ `value={{ user, cart, theme }}` — هر تغییر همه `consumer`ها را `re-render` می‌کند  
❌ فراموش کردن `Provider` — مقدار پیش‌فرض `undefined`  
❌ جایگزین Redux برای سبد خرید بزرگ با ده‌ها `action`

---

## ارتباط با مفاهیم دیگر

- [State-Types](./State-Types.md) — `Global` / `UI state`
- [useReducer Pattern](./useReducer-Pattern.md) — ترکیب Context + reducer
- [Redux](./Redux.md) — وقتی Context کافی نیست
- [Context](../Context.md) — مفهوم Core

---

## خلاصه

با Context API داده در `subtree` بدون `prop drilling` به اشتراک گذاشته می‌شود — عالی برای `theme` و `auth`؛ ضعیف برای `state` پرتغییر و سراسری پیچیده.

---

## 📚 منابع

- [Passing Data Deeply with Context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
- [useContext — react.dev](https://react.dev/reference/react/useContext)
- جزوه: Context API — `PostContext` در atomic-blog
