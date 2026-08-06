# Context — Context API

> مکانیزم React برای پاس دادن داده به عمق درخت کامپوننت بدون `prop drilling`.

## 📖 مفهوم

برای پاس دادن داده به عمق درخت بدون `prop drilling`، از `Context` استفاده می‌شود. می‌توانید داده‌ای را در سطح بالای درخت تعریف کنید و هر کامپوننت زیرین بدون پاس دادن `prop` از میان واسطه‌ها به آن دسترسی داشته باشد.

## چرا این ویژگی وجود دارد؟

وقتی `prop drilling` (پاس دادن `prop` از ۵–۶ سطح) رخ می‌دهد، کد شلوغ و نگهداری سخت می‌شود.

## چه مشکلی را حل می‌کند؟

- دسترسی به داده سراسری: تم، زبان، کاربر لاگین‌شده
- حذف `prop drilling` برای داده‌های کم‌تغییر

## ⚙️ نحوه کار

```jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(email, password) {
    // authenticate...
    setUser({ email });
  }

  function logout() {
    setUser(null);
  }

  const value = { user, login, logout };

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

// استفاده در هر عمقی:
function ProfileButton() {
  const { user, logout } = useAuth();
  return user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>;
}
```

## Syntax

```jsx
const MyContext = createContext(defaultValue);

// React 19+ (توصیه‌شده)
<MyContext value={value}>{children}</MyContext>

// React 18 و قبل‌تر (legacy)
<MyContext.Provider value={value}>{children}</MyContext.Provider>

const value = useContext(MyContext);
```

## پارامترها

| API | توضیح |
|-----|--------|
| `createContext(default)` | ساخت `context` |
| `<Context value={}>` | مقدار در دسترس `descendants` (React 19+) |
| `Provider value={}` | همان کار — `syntax` قدیمی (React 18-) |
| `useContext(Context)` | خواندن مقدار فعلی |

## مثال واقعی در پروژه

**اپ سفر (`worldwise`):** `CitiesContext` لیست شهرها و عملیات CRUD را در کل اپ در دسترس قرار می‌دهد. نمونه کد: [Examples/state-management/CartContext.jsx](./Examples/state-management/CartContext.jsx)

## ⚠️ اشتباهات رایج

- ❌ استفاده از Context برای هر `state` (باعث `re-render` کل `subtree`)
- ❌ `object` جدید در هر `render` به‌عنوان `value` (`value={{ user, login }}` بدون `memo`)
- ❌ استفاده از Context جایگزین Redux برای `state` پیچیده

## 🚀 Best Practices

- ✅ `custom hook` (`useAuth`) برای `encapsulation`
- ✅ چند `context` کوچک به‌جای یک `context` غول‌پیکر
- ✅ `useMemo` برای `value object` اگر باعث `re-render` غیرضروری می‌شود
- ✅ برای `state` پیچیده: Context + `useReducer`

## چه زمانی استفاده کنیم؟

- تم، زبان، `auth`، تنظیمات سراسری
- `prop drilling` بیش از ۲–۳ سطح

## چه زمانی استفاده نکنیم؟

- `state` فقط در ۱–۲ کامپوننت → `useState` محلی
- `state` پرتغییر با `logic` پیچیده → Redux Toolkit
- داده `server` → React Query

## ارتباط با مفاهیم دیگر

- [Hooks/useContext](./Hooks/useContext.md)
- [Sharing State](./Sharing-State.md)
- [State-Management/Context-API](./State-Management/Context-API.md)
- [State-Management/useReducer-Pattern](./State-Management/useReducer-Pattern.md)

## 💡 نکات مهم

- در React 19: خود `context object` به‌عنوان `provider` استفاده می‌شود (`<ThemeContext value={theme}>`) — دیگر نیازی به `.Provider` نیست.
- تغییر `value` در `Provider` باعث `re-render` **همه** `consumer`ها می‌شود
- برای **خواندن**، Context عالی است؛ برای `state` پیچیده با `mutation` زیاد، `useReducer` ترکیب کنید

## 🎯 سوالات رایج مصاحبه

- مشکل Context چیست؟ (`re-render`)
- تفاوت Context و Redux چیست؟

## خلاصه

داده سراسری بدون `prop drilling` = Context. برای داده کم‌تغییر و سراسری ایده‌آل است.

## 📚 منابع

- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useContext](https://react.dev/reference/react/useContext)
