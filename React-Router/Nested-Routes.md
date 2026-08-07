# Nested Routes

> 🧭 پیش‌نیاز: [Routing Basics](./Routing-Basics.md) · بعدی: [Dynamic Routes](./Dynamic-Routes.md)

---

## 📖 مفهوم

مسیرهای تودرتو (Nested Routes) وقتی بخشی از UI — مثل navbar یا sidebar — در چند «صفحه» ثابت بماند و فقط محتوای وسط عوض شود. والد layout را `render` می‌کند و فرزند در `<Outlet />` جای می‌گیرد.

در پروژه Worldwise، لیست کشورها و جزئیات شهر هر دو زیر `/app` هستند؛ URL بخشی از رابط را کنترل می‌کند.

---

## چرا این ویژگی وجود دارد؟

بدون nested route باید navbar را در هر صفحه تکرار کنید یا با `children` prop دستی پاس بدهید. کتابخانه React Router این را با `Outlet` و ساختار درختی `Route` استاندارد می‌کند.

---

## چه مشکلی را حل می‌کند؟

- layout مشترک (`AppLayout`)
- URL سلسله‌مراتبی (`/app/settings`، `/app/dashboard`)
- مسیر `index` پیش‌فرض وقتی segment خالی است

---

## ⚙️ نحوه کار

### ساختار Route تودرتو

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- `/app` → فقط `AppLayout` (تا وقتی `index` redirect نکند)
- `/app/dashboard` → `AppLayout` + `Dashboard` داخل `Outlet`

### AppLayout و Outlet

```jsx
// ui/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Header />
        <Outlet /> {/* محتوای route فرزند اینجا */}
      </main>
    </div>
  );
}
```

`Outlet` مثل «جای خالی» layout است — route فرزند فعال آنجا `render` می‌شود. به همین دلیل به layout route می‌گوین (بدون `props` مسیر).

### Index Route

وقتی URL دقیقاً `/app` است و هیچ segment بعدی نداریم، `index` اجرا می‌شود:

```jsx
<Route index element={<Navigate replace to="dashboard" />} />
```

در Worldwise ورود به `/app` بدون مسیر فرزند → redirect به مسیر پیش‌فرض.

### چند سطح تودرتو

```jsx
<Route path="countries" element={<CountryList />}>
  <Route path=":countryCode" element={<CountryDetail />}>
    <Route path="cities/:cityId" element={<CityDetail />} />
  </Route>
</Route>
```

URL نمونه: `/app/countries/ir/cities/42`

---

## تفاوت با گزینه‌های مشابه

| الگو | کی |
|------|-----|
| Nested + `Outlet` | layout + چند صفحه زیر یک prefix |
| کامپوننت والد با `{children}` | بدون router — فقط UI |
| Next.js `layout.js` | همان ایده در فایل‌سیستم (M10) |

---

## مثال واقعی در پروژه

**Wild Oasis:** یک `AppLayout` (sidebar + header) برای `dashboard`، `cabins`، `bookings`، `settings` — همه فرزند یک `Route` والد.

**Worldwise:** کشورها و شهرها — UI نقشه با URL همگام.

مثال کد: [Examples/react-router/NestedRoutes.jsx](../Examples/react-router/NestedRoutes.jsx)

---

## 🚀 Best Practices

✅ layout را route والد کنید، نه import در هر page  
✅ `index` برای redirect یا صفحه پیش‌فرض segment  
✅ `NavLink` در sidebar برای highlight مسیر فعال — [Navigation](./Navigation.md)  
❌ تکرار navbar در هر `pages/*.jsx`

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `<Outlet />` — layout خالی می‌ماند  
❌ `path="/dashboard"` در فرزند وقتی والد `/app` است — باید `path="dashboard"` (نسبی)  
❌ انتظار render فرزند بدون تعریف `Route` فرزند

---

## ارتباط با مفاهیم دیگر

- [Routing Basics](./Routing-Basics.md)
- [Dynamic Routes](./Dynamic-Routes.md) — `:param` در سطح nested
- [Navigation](./Navigation.md) — `NavLink` در layout
- [Nextjs/Layouts](../Nextjs/Layouts.md) — معادل در Next.js

---

## خلاصه

Route والد = layout + `Outlet`؛ Route فرزند = محتوای متغیر؛ `index` = پیش‌فرض segment؛ URL سلسله‌مراتبی = nested routes.

---

## 📚 منابع

- [Nested Routes](https://reactrouter.com/en/main/start/tutorial#nested-routes)
- [Outlet](https://reactrouter.com/en/main/components/outlet)
- [Index Route](https://reactrouter.com/en/main/route/route#index-routes)
