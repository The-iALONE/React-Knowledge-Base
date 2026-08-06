# useContext

> برای خواندن مقدار نزدیک‌ترین `context provider` در درخت کامپوننت — بدون `prop drilling`.

---

## 📖 مفهوم

برای خواندن مقدار `value` فعلی `Provider` والد، از `useContext` استفاده می‌شود. هر زمان `value` `Provider` تغییر کند، همه کامپوننت‌هایی که آن `context` را `subscribe` کرده‌اند `re-render` می‌شوند.

---

## چرا

داده‌های سراسری (تم، زبان، کاربر، سبد خرید) نباید از ۵–۱۰ سطح `prop` عبور کنند. Context API راه رسمی React برای `share` کردن این داده‌هاست.

---

## مشکل

- `Context` برای **هر** `state` → `re-render` کل `subtree`.
- `value={{ user, login }}` بدون `memo` → `object` جدید هر `render` → `re-render` همه `consumer`ها.
- جایگزین Redux برای `state` پیچیده و پرتغییر — anti-pattern.

---

## نحوه کار

1. `createContext(defaultValue)` یک `Context` `object` می‌سازد.
2. `Provider` در بالای درخت `value` را `set` می‌کند.
3. `useContext` نزدیک‌ترین `Provider` را پیدا و `value` را برمی‌گرداند.
4. اگر `Provider` نباشد → `defaultValue` از `createContext`.

---

## Syntax

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Toolbar />
    </ThemeContext>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

---

## پارامترها

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `Context` | `React.Context<T>` | `object` ساخته‌شده با `createContext` |

---

## مقدار بازگشتی

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `value` | `T` | مقدار فعلی `Provider` (یا `default`) |

---

## مثال ساده

```jsx
import { createContext, useContext, useState } from 'react';

const CountContext = createContext(null);

function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CountContext value={{ count, setCount }}>
      {children}
    </CountContext>
  );
}

function Counter() {
  const { count, setCount } = useContext(CountContext);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

## مثال واقعی

### Dashboard — تم و زبان

```jsx
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [locale, setLocale] = useState('fa');

  const value = useMemo(() => ({
    theme, setTheme, locale, setLocale,
  }), [theme, locale]);

  return (
    <SettingsContext value={value}>
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings requires SettingsProvider');
  return ctx;
}
```

### Auth — وضعیت کاربر

```jsx
function ProfileButton() {
  const { user, logout } = useAuth();
  return user
    ? <button onClick={logout}>Logout ({user.email})</button>
    : <Link to="/login">Login</Link>;
}
```

### E-commerce — سبد خرید

```jsx
function CartBadge() {
  const { items } = useContext(CartContext);
  const total = items.reduce((sum, i) => sum + i.qty, 0);
  return <span className="badge">{total}</span>;
}
```

---

## اشتباهات

```jsx
// ❌ value جدید هر render
<AuthContext.Provider value={{ user, login }}>

// ✅ memoize value
const value = useMemo(() => ({ user, login }), [user, login]);

// ❌ یک context برای همه چیز
<AppContext.Provider value={{ theme, cart, user, ... }}>

// ✅ split contexts by concern
```

---

## Best Practices

- `Custom hook` (`useAuth`) با `guard` برای `Provider`.
- `value` را با `useMemo` `stabilize` کنید.
- `context`های جدا برای `concern`های مختلف (تم در برابر `cart`).
- برای `state` پرتغییر سراسری → Zustand/Redux/React Query.

---

## When to Use / Not

| استفاده کنید | استفاده نکنید |
|-------------|---------------|
| تم، locale، auth user | هر `state` محلی |
| داده کم‌تغییر سراسری | server `state` → React Query |
| جلوگیری از `prop drilling` | `state` پیچیده با `update`های زیاد |

---

## ارتباط با مفاهیم

- [Context.md](../Context.md) — Context API کامل
- [useReducer.md](./useReducer.md) — ترکیب با `reducer` در Provider
- [State-Management/README.md](../State-Management/README.md)

---

## نکات

- `useContext` جایگزین `Context.Consumer` است (API قدیمی).
- React 19: `<Context value={}>` به‌جای `<Context.Provider value={}>`.
- React 19: `use(Context)` هم می‌تواند `context` را بخواند (در `render`، حتی شرطی).
- نمونه کد: [Examples/state-management/CartContext.jsx](../Examples/state-management/CartContext.jsx)

---

## Interview

**سوال:** چرا Context باعث `re-render` زیاد می‌شود؟  
**جواب:** با هر تغییر `value` همه `consumer`های آن `context` `re-render` می‌شوند — حتی اگر فقط بخشی از `value` استفاده کنند.

**سوال:** چطور بهینه کنیم؟  
**جواب:** با `split` کردن `context`، `memoize` کردن `value`، یا `state management` با `selector`.

---

## خلاصه

با `useContext` می‌توان `shared value` را از `Provider` خواند. برای داده سراسری کم‌تغییر عالی است؛ `value` را `memo` کنید و `overuse` نکنید.

---

## منابع

- [useContext — react.dev](https://react.dev/reference/react/useContext)
- [Passing Data Deeply with Context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
