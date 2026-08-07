# Lazy Loading — بارگذاری تنبل

> بارگذاری کامپوننت فقط هنگام نیاز با `React.lazy` و `import()` — کاهش حجم `bundle` اولیه.

> 🧭 پیش‌نیاز: [Suspense](./Suspense.md) · بعدی: [`use`](../Hooks/use.md)

---

## 📖 مفهوم

برای تقسیم کد و بارگذاری کامپوننت فقط وقتی لازم است، از `React.lazy` همراه `dynamic import` استفاده می‌شود. کامپوننت `lazy` هنگام اولین `render` `suspend` می‌کند و باید داخل `<Suspense>` باشد.

---

## چرا

`bundle` بزرگ یعنی زمان بارگذاری اولیه طولانی — کاربر صفحه خالی می‌بیند. همه کامپوننت‌ها در اولین بازدید لازم نیستند: پنل ادمین، نمودار سنگین، یا صفحه تنظیمات فقط وقتی کاربر به آن مسیر می‌رود باید لود شوند.

---

## چه مشکلی را حل می‌کند؟

- `bundle` اولیه سنگین
- بارگذاری کد غیرضروری در routeهایی که کاربر نمی‌رود
- عدم جداسازی منطقی `feature`ها در `build`

---

## ⚙️ نحوه کار

1. `React.lazy(() => import('./Heavy'))` یک کامپوننت `lazy` می‌سازد
2. در اولین `render`، `import()` اجرا می‌شود
3. تا resolve شدن، کامپوننت `suspend` می‌کند
4. نزدیک‌ترین `<Suspense>` بالاسری `fallback` را نشان می‌دهد
5. بعد از `load`، کامپوننت `render` می‌شود

---

## Syntax

```jsx
import { lazy, Suspense } from "react";

const SettingsPage = lazy(() => import("./SettingsPage"));

function App() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
```

### `Named export`

```jsx
const Chart = lazy(() =>
  import("./Chart").then((module) => ({ default: module.Chart })),
);
```

### تقسیم در سطح `route` (مفهومی)

```jsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

function Router({ route }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {route === "dashboard" && <Dashboard />}
      {route === "profile" && <Profile />}
    </Suspense>
  );
}
```

در Next.js/App Router، `dynamic import` در سطح فایل `route` به‌صورت خودکار انجام می‌شود — [Next.js Overview](../Nextjs/README.md).

---

## 💡 مثال کامل

```jsx
import { lazy, Suspense, useState } from "react";

const AdminPanel = lazy(() => import("./AdminPanel"));

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAdmin(true)}>پنل ادمین</button>
      {showAdmin && (
        <Suspense fallback={<p>بارگذاری پنل...</p>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 🚀 Best Practices

- همیشه `<Suspense>` دور کامپوننت `lazy`
- `fallback` سبک (`skeleton`/`spinner`)
- در سطح `route` یا `feature` `split` کنید — نه هر کامپوننت کوچک
- در Next.js از `next/dynamic` برای کنترل SSR استفاده کنید — مثلاً `dynamic(() => import('./Chart'), { ssr: false })` برای کامپوننت‌های فقط-مرورگر (M10)

---

## ⚠️ اشتباهات رایج

- `lazy` بدون `Suspense` — خطای `runtime`
- `lazy` روی کامپوننت‌های خیلی کوچک — `overhead` بیشتر از سود
- `import()` در هر `render` — فقط یک‌بار در `lazy()`
- فراموش کردن `default export` در فایل import‌شده

---

## تفاوت با `Code Splitting`

| مفهوم             | سطح                              |
| ----------------- | -------------------------------- |
| `React.lazy`      | کامپوننت React                   |
| `import()` دستی   | ماژول JS                         |
| `Route splitting` | فریم‌ورک (Next.js، React Router) |

جزئیات بیشتر: [Performance/Code-Splitting.md](../Performance/Code-Splitting.md) (M6).

---

## ارتباط با مفاهیم دیگر

- [Suspense.md](./Suspense.md) — الزامی برای `lazy`
- [Concurrent-Features.md](./Concurrent-Features.md)
- [Performance/Code-Splitting.md](../Performance/Code-Splitting.md)
- [Examples/escape-hatches/SuspenseLazy.jsx](../Examples/escape-hatches/SuspenseLazy.jsx)

---

## خلاصه

`React.lazy` + `import()` = بارگذاری تنبل کامپوننت. همیشه با `<Suspense>` و `fallback` مناسب.

---

## 📚 منابع

- [lazy — react.dev](https://react.dev/reference/react/lazy)
- [Code Splitting — react.dev](https://react.dev/learn/code-splitting)
- [Suspense — react.dev](https://react.dev/reference/react/Suspense)
