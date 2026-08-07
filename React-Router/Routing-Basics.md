# Routing Basics

> 🧭 پیش‌نیاز: [React Router — نمای کلی](./README.md) · [Components](../Components.md) · بعدی: [Nested Routes](./Nested-Routes.md)

---

## 📖 مفهوم

مبانی مسیریابی در اپ تک‌صفحه‌ای (SPA): نصب `react-router-dom`، `BrowserRouter`، `Routes`/`Route`، و صفحه ۴۰۴.

وقتی کاربر آدرس `/dashboard` را باز می‌کند، کتابخانه React Router کامپوننت مربوط را `render` می‌کند — بدون بارگذاری مجدد کل HTML از سرور (برخلاف MPA کلاسیک).

---

## چرا این ویژگی وجود دارد؟

در SPA فقط یک `index.html` بارگذاری می‌شود؛ «صفحات» در واقع جایگزینی کامپوننت در همان document هستند. بدون router، URL و UI همگام نمی‌مانند و دکمه Back مرورگر کار نمی‌کند.

---

## چه مشکلی را حل می‌کند؟

- نگاشت مسیر به کامپوننت
- همگام‌سازی URL با UI
- history مرورگر (`back`/`forward`)
- مسیر نامعتبر → صفحه خطا

---

## ⚙️ نحوه کار

### SPA چیست؟

اپ تک‌صفحه‌ای (`SPA` / Single Page Application) — یک بار HTML لود می‌شود؛ JavaScript مسیر را عوض می‌کند. React Router روی History API مرورگر (`pushState`) سوار است.

### نصب

```bash
npm install react-router-dom
```

### ساختار پایه

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

| API | نقش |
|-----|-----|
| `BrowserRouter` | context مسیریابی؛ history واقعی مرورگر |
| `Routes` | انتخاب یک `Route` منطبق با URL فعلی |
| `Route` | `path` + `element` (کامپوننت) |
| `element` | JSX که باید `render` شود |
| `Navigate` | هدایت بدون کلیک — `replace` history قبلی را جایگزین می‌کند |
| `path="*"` | catch-all — مثلاً `/Workers` وقتی چنین صفحه‌ای نداریم |

### `Navigate` و `replace`

```jsx
<Route index element={<Navigate replace to="dashboard" />} />
```

با `replace`، کاربر با Back به مسیر قبلی قبل از redirect برنمی‌گردد — برای redirect پیش‌فرض مناسب است.

---

## تفاوت با گزینه‌های مشابه

| روش | کی استفاده شود |
|-----|----------------|
| React Router | SPA با Vite/CRA — کنترل کامل |
| Next.js file routing | وقتی SSR/RSC می‌خواهید (M10) |
| `window.location` | تقریباً هرگز در React |

---

## مثال واقعی در پروژه

**Wild Oasis:** `App.jsx` — `QueryClientProvider` بیرون، `BrowserRouter` داخل؛ مسیر `login` عمومی و بقیه زیر `ProtectedRoute` (جزئیات در [Navigation](./Navigation.md)).

---

## 🚀 Best Practices

✅ `path="*"` را آخر `Routes` بگذارید  
✅ صفحه ۴۰۴ جدا (`PageNotFound`) — UX بهتر از صفحه سفید  
✅ `BrowserRouter` یک‌بار در ریشه (معمولاً `App`)  
❌ چند `BrowserRouter` تو در تو

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `element={...}` — route بدون UI  
❌ `path` بدون `/` در root vs نسبی — در nested بعداً مهم می‌شود  
❌ انتظار `reload` سرور برای هر مسیر — SPA این‌طور کار نمی‌کند

---

## ارتباط با مفاهیم دیگر

- [Nested Routes](./Nested-Routes.md) — layout و `Outlet`
- [Navigation](./Navigation.md) — `Link` به‌جای `<a href>`
- [Performance/Code-Splitting](../Performance/Code-Splitting.md) — `lazy` برای route

---

## خلاصه

`npm install react-router-dom` → `BrowserRouter` → `Routes`/`Route` → `element`؛ برای redirect از `Navigate`؛ برای URL نامعتبر `path="*"`.

---

## 📚 منابع

- [React Router — Installation](https://reactrouter.com/en/main/start/installation)
- [Route](https://reactrouter.com/en/main/route/route)
- [Navigate](https://reactrouter.com/en/main/components/navigate)
