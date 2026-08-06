# Higher-Order Components (HOC)

الگوی `wrap` کردن کامپوننت برای افزودن رفتار یا داده بدون تغییر خود کامپوننت.

---
## 📖 مفهوم

کامپوننت مرتبه‌بالاتر (`HOC`) تابعی است که یک کامپوننت می‌گیرد و کامپوننت جدید با قابلیت اضافه برمی‌گرداند: `(WrappedComponent) => EnhancedComponent`.

---
## چرا این ویژگی وجود دارد؟

قبل از `Hooks`، `HOC` راه استاندارد برای `cross-cutting concerns` (`auth`، `logging`، `data fetching`) بود.

---
## چه مشکلی را حل می‌کند؟

`reuse` منطق در چند کامپوننت بدون `duplicate code` یا `mixin`.

---
## ⚙️ نحوه کار

1. `HOC` کامپوننت را `wrap` می‌کند.
2. `props` اضافه `inject` می‌کند یا رفتار `wrap` می‌کند.
3. `displayName` برای DevTools تنظیم می‌شود.
4. `ref` با `forwardRef` `forward` می‌شود (در صورت نیاز).

---
## چه زمانی استفاده کنیم؟

- نگهداری کد `legacy` (redux `connect`, react-router `withRouter`)
- کتابخانه‌هایی که `HOC` export می‌کنند
- `React.memo` خودش یک `HOC` است
- `cross-cutting concerns` بدون `coupling` UI (`Error Boundary`، `Logger`)

---
## چه زمانی استفاده نکنیم؟

- پروژه جدید → `Custom Hooks`
- وقتی `prop collision` یا `wrapper hell` ایجاد می‌شود

---
## Syntax

```jsx
function withAuth(WrappedComponent) {
  function WithAuth(props) {
    const user = useAuth(); // یا از Context

    if (!user) {
      return <p>Please log in</p>;
    }

    return <WrappedComponent {...props} user={user} />;
  }

  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// استفاده
const ProtectedDashboard = withAuth(Dashboard);
```

---
## `forwardRef` در HOC

اگر کامپوننت `wrap` شده باید `ref` بگیرد، `HOC` باید `ref` را به `WrappedComponent` پاس دهد:

```jsx
import { forwardRef } from 'react';

function withLogging(WrappedComponent) {
  function WithLogging(props, ref) {
    console.log('Rendering:', WrappedComponent.name);
    return <WrappedComponent {...props} ref={ref} />;
  }

  WithLogging.displayName = `withLogging(${getDisplayName(WrappedComponent)})`;
  return forwardRef(WithLogging);
}

// کامپوننت wrapped باید forwardRef باشد اگر ref می‌گیرد
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} {...props} />;
});

const LoggedFancyInput = withLogging(FancyInput);
```

بدون `forwardRef`، `ref` به `HOC` می‌رسد نه به DOM داخل `WrappedComponent`.

---
## 💡 مثال — withLoading

```jsx
function withLoading(WrappedComponent) {
  function WithLoading({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="spinner">Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  }
  return WithLoading;
}

function UserProfile({ user }) {
  return <h1>{user.name}</h1>;
}

const UserProfileWithLoading = withLoading(UserProfile);

// در parent:
// <UserProfileWithLoading isLoading={loading} user={user} />
```

---
## معادل Hook

```jsx
function useRequireAuth() {
  const user = useAuth();
  if (!user) throw new RedirectError('/login');
  return user;
}

function Dashboard() {
  const user = useRequireAuth();
  return <h1>Welcome, {user.name}</h1>;
}
```

---
## مثال واقعی در پروژه

`connect()` در Redux classic یک `HOC` بود. در Redux Toolkit مدرن از `useSelector` / `useDispatch` استفاده می‌شود (جزئیات در M7 — [State Management](../State-Management/README.md)). `React.memo` همچنان `HOC` پرکاربرد است.

---
## 🚀 Best Practices

✅ یک `concern` برای هر `HOC`  
✅ `spread` بقیه `props`: `{...props}`  
✅ `displayName` برای `debug`  
✅ `forwardRef` اگر `ref` لازم است  
❌ `HOC` داخل `render` (کامپوننت جدید هر بار)  
❌ `mutate` کردن `WrappedComponent`

---
## ارتباط با مفاهیم دیگر

- [React.memo](./React-Memo.md)
- [Render Props](./Render-Props.md)
- [Custom Hooks](../Custom-Hooks.md)
- [State Management Overview](../State-Management/README.md) — Redux و `connect` (M7)
- [Reusability Patterns](./Reusability-Patterns.md)

---
## خلاصه

`HOC` = `wrap` کردن کامپوننت برای افزودن `behavior`. در کد جدید `Hooks` جایگزین اصلی‌اند؛ `memo` و کتابخانه‌های `legacy` هنوز `HOC` دارند. برای `ref` همیشه `forwardRef` را در نظر بگیرید.

---
## 📚 منابع

- [forwardRef — react.dev](https://react.dev/reference/react/forwardRef)
- [Reusing Logic with Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
