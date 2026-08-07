# React Router — نمای کلی

> 🧭 پیش‌نیاز: [React Hook Form](../State-Management/React-Hook-Form.md) · [State-Types](../State-Management/State-Types.md) · بعدی: [Routing Basics](./Routing-Basics.md)

---

## 📖 مفهوم

راهنمای مسیریابی در اپ React با React Router — از SPA و نصب تا مسیر تودرتو، پارامتر پویا، ناوبری، محافظت مسیر، و نگه‌داری `state` در URL.

در اپ‌های تک‌صفحه‌ای، این کتابخانه آدرس مرورگر را به کامپوننت‌ها نگاشت می‌کند؛ بدون `reload` کامل صفحه، کاربر بین «صفحات» جابه‌جا می‌شود. در React خودِ فریم‌ورک مسیریابی ندارد — برای SPA معمولاً `react-router-dom` انتخاب می‌شود.

---

## چرا این ویژگی وجود دارد؟

اپ چندصفحه‌ای بدون مسیریابی یا با `window.location` دستی، `history` مرورگر را از دست می‌دهد و UX شبیه وب قدیمی می‌شود. کتابخانه React Router، `history`، `back`/`forward`، و اشتراک لینک را استاندارد می‌کند.

---

## چه مشکلی را حل می‌کند؟

- نگاشت URL → کامپوننت (`/cabins` → `CabinTable`)
- layout مشترک (`AppLayout` + `Outlet`) بدون تکرار navbar
- پارامتر مسیر (`/cities/:cityId`) و query (`?sortBy=price`)
- ناوبری `declarative` (`Link`) و `imperative` (`useNavigate`)
- محافظت مسیرهای خصوصی (داشبورد ادمین)
- `URL state` قابل share و bookmark

---

## ⚙️ نحوه کار — دو روش setup

### روش ۱: Declarative (جزوه — Wild Oasis / Worldwise)

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

مناسب یادگیری و پروژه‌های متوسط — همان الگوی دوره.

### روش ۲: Data Router (React Router 6.4+)

```jsx
// router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

برای `loader`/`action`، prefetch داده قبل از رندر، و error boundary مسیری — در M8 پایه روی روش ۱ تمرکز داریم؛ روش ۲ برای پروژه‌های بزرگ‌تر.

| معیار | `BrowserRouter` | `createBrowserRouter` |
|-------|-----------------|----------------------|
| یادگیری | ساده‌تر | کمی بیشتر |
| `loader`/`action` | ندارد | دارد |
| جزوه دوره | ✅ | اختیاری |

---

## مسیر یادگیری پیشنهادی

```
Routing Basics → Nested Routes → Dynamic Routes
    → Navigation (+ Protected Routes) → State in URL
```

---

## فهرست مستندات

| موضوع | فایل | بهترین برای |
|-------|------|-------------|
| SPA و setup پایه | [Routing-Basics](./Routing-Basics.md) | اولین قدم |
| مسیر تودرتو و layout | [Nested-Routes](./Nested-Routes.md) | `Outlet`، `index` |
| پارامتر پویا | [Dynamic-Routes](./Dynamic-Routes.md) | `:id`، `useParams` |
| ناوبری و محافظت | [Navigation](./Navigation.md) | `Link`، `useNavigate`، `ProtectedRoute` |
| `state` در URL | [State-In-URL](./State-In-URL.md) | `useSearchParams`، فیلتر |

---

## تفاوت با Next.js (M10)

| | React Router (M8) | Next.js App Router (M10) |
|---|-------------------|--------------------------|
| محل تعریف مسیر | JSX (`<Route>`) یا config | ساختار پوشه `app/` |
| رندر سرور | خودتان setup کنید | پیش‌فرض |
| محافظت مسیر | کامپوننت `ProtectedRoute` | `middleware.ts` + layout |
| `URL state` | `useSearchParams` | `searchParams` prop / `useSearchParams` |

هر دو «مسیریابی» هستند؛ Next.js فریم‌ورک کامل است — تداخلی در محتوا نیست.

---

## مثال واقعی در پروژه

- **Worldwise:** مسیر تودرتو `/app/countries/:countryCode/cities/:cityId` — نقشه + لیست شهر
- **Wild Oasis:** `AppLayout` + `ProtectedRoute` + فیلتر کابین با `?discount=` و `?sortBy=`
- **fast-react-pizza:** سبد خرید بدون login اجباری؛ الگوی ساده‌تر

مثال‌های کد: [Examples/react-router/](../Examples/react-router/)

---

## 🚀 Best Practices

✅ مسیرهای عمومی (`login`) بیرون از `ProtectedRoute`  
✅ فیلتر و صفحه‌بندی را در query string بگذارید اگر share مهم است  
✅ `lazy` + `Suspense` برای route component سنگین — [Code Splitting](../Performance/Code-Splitting.md)  
✅ `NavLink` برای منویی که حالت فعال دارد  
❌ `useEffect` + `window.location` برای هر ناوبری  
❌ `state` محلی برای فیلتری که کاربر انتظار لینک shareable دارد

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `BrowserRouter` دور `Routes`  
❌ `to={/${id}}` به‌جای `to={id}` در مسیر تودرتو — می‌رود root  
❌ محافظت فقط با مخفی کردن دکمه منو (کاربر مستقیم URL می‌زند)  
❌ قاطی کردن auth logic داخل هر صفحه به‌جای یک `ProtectedRoute`

---

## ارتباط با مفاهیم دیگر

- [State-Types — URL / Navigation State](../State-Management/State-Types.md)
- [Sharing State](../Sharing-State.md) — `state` در URL
- [Performance/Code-Splitting](../Performance/Code-Splitting.md) — `lazy` route
- [State-Management/React-Query](../State-Management/React-Query.md) — session + `navigate` بعد از login
- [Nextjs/Routing-And-Pages](../Nextjs/Routing-And-Pages.md) — مسیریابی فریم‌ورک (M10)

---

## خلاصه

در React Router، آدرس مرورگر به کامپوننت وصل می‌شود: از `Routing-Basics` شروع کن، layout را با `Outlet` بساز، پارامتر با `useParams`، ناوبری با `Link`/`useNavigate`، مسیر خصوصی با `ProtectedRoute`، و فیلتر shareable با `useSearchParams`.

---

## 📚 منابع

- [React Router — Home](https://reactrouter.com)
- [Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Routing](https://reactrouter.com/en/main/start/concepts#routing)
