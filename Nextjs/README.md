# Next.js — Overview

> 🧭 پیش‌نیاز: [CSS-in-JS](../Styling/CSS-in-JS.md) · بعدی: [Project Setup](./Project-Setup.md)

مرور کلی فریم‌ورک Next.js و App Router برای ساخت اپلیکیشن‌های React در سطح `production`.

---

## 📖 مفهوم

فریم‌ورک Next.js روی React است که `routing`، `rendering` سمت سرور، `data fetching`، بهینه‌سازی تصویر/فونت، و ابزارهای `deployment` را یکجا فراهم می‌کند. از نسخه ۱۳ به بعد، App Router (`app/`) جایگزین Pages Router (`pages/`) شده و مدل React Server Components (`RSC`) را پشتیبانی می‌کند.

---

## چرا این ویژگی وجود دارد؟

به‌تنهایی React فقط UI را می‌سازد؛ برای `routing`، SSR، SEO و اتصال به backend باید کتابخانه‌های زیادی اضافه شود. Next.js این لایه‌ها را استاندارد و یکپارچه می‌کند.

---

## چه مشکلی را حل می‌کند؟

- SEO و زمان بارگذاری اولیه (SSR/SSG/ISR)
- ساختار فایل‌محور برای `route`ها
- جداسازی Server و Client Components
- فرم‌ها و mutation بدون API جدا ([Server Actions](./Server-Actions.md))
- احراز هویت و middleware
- اتصال به backend (مثل [Supabase](./Backend-Integration-Supabase.md))

---

## ⚙️ نحوه کار

در App Router، پاسخ سرور از این مسیر عبور می‌کند:

```
Request → Middleware → App Router → Layout + Page (RSC/Client) → Response (HTML + RSC Payload)
```

فایل‌محور: هر پوشه در `app/` می‌تواند `page.tsx`، `layout.tsx`، `loading.tsx`، `error.tsx` داشته باشد.

---

## چه زمانی استفاده کنیم؟

- اپلیکیشن full-stack یا نیازمند SEO
- داشبورد با داده سمت سرور
- پروژه‌هایی مثل **Wild Oasis** (رزرو، احراز هویت، Supabase)

---

## چه زمانی استفاده نکنیم؟

- SPA کاملاً داخلی بدون نیاز SEO (Vite + React کافی است)
- وقتی تیم فقط با Pages Router آشناست و migration هزینه بالایی دارد

---

## Syntax — ساختار پوشه App Router

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # /
├── loading.tsx         # Global loading UI
├── error.tsx           # Global error boundary
├── account/
│   ├── layout.tsx
│   ├── page.tsx
│   └── profile/
│       └── page.tsx    # /account/profile
├── cabins/
│   ├── page.tsx        # /cabins
│   └── [cabinId]/
│       └── page.tsx    # /cabins/123
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts
```

---

## 💡 مثال ساده

```tsx
// app/page.tsx — Server Component (پیش‌فرض)
export default async function HomePage() {
  return <h1>Welcome to Wild Oasis</h1>;
}
```

---

## مثال واقعی در پروژه

در دوره Wild Oasis:

- `app/cabins/` لیست کابین‌ها با RSC و `fetch`
- `app/account/` محافظت‌شده با [Middleware](./Middleware.md) و [NextAuth](./Authentication-NextAuth.md)
- فرم رزرو با [Server Actions](./Server-Actions.md) و `useOptimistic`

---

## 🚀 Best Practices

✅ پیش‌فرض App Router و Server Components را در نظر بگیرید  
✅ `"use client"` فقط وقتی hook یا event لازم است  
✅ داده را نزدیک محل مصرف `fetch` کنید ([colocation](../Performance/State-Colocation.md))  
✅ از `loading.js` و `error.js` برای تجربهٔ کاربری بهتر استفاده کنید  
✅ `cache` و `revalidate` را صریح مدیریت کنید

---

## مسیر یادگیری پیشنهادی

```
نمای کلی → راه‌اندازی → مسیریابی → چیدمان → ناوبری → بارگذاری/خطا
→ واکشی داده → استراتژی رندر → استریمینگ → کامپوننت سرور → ترکیب کلاینت/سرور
→ اکشن سرور → Route Handler → میان‌افزار → احراز هویت → متادیتا → تصویر/فونت → Supabase
```

---

## فهرست این بخش

| موضوع               | فایل                                                              |
| ------------------- | ----------------------------------------------------------------- |
| راه‌اندازی          | [Project-Setup](./Project-Setup.md)                               |
| مسیریابی            | [Routing-And-Pages](./Routing-And-Pages.md)                       |
| چیدمان              | [Layouts](./Layouts.md)                                           |
| ناوبری              | [Navigation](./Navigation.md)                                     |
| بارگذاری و خطا      | [Loading-And-Error-States](./Loading-And-Error-States.md)       |
| داده و cache        | [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)       |
| SSR / SSG / ISR     | [Rendering-Strategies](./Rendering-Strategies.md)                 |
| استریمینگ           | [Streaming-And-Suspense](./Streaming-And-Suspense.md)             |
| RSC در App Router   | [Server-Components](./Server-Components.md)                       |
| ترکیب Server/Client | [Client-Server-Interleaving](./Client-Server-Interleaving.md)     |
| اکشن سرور           | [Server-Actions](./Server-Actions.md)                             |
| API Routes          | [Route-Handlers](./Route-Handlers.md)                             |
| میان‌افزار          | [Middleware](./Middleware.md)                                     |
| احراز هویت          | [Authentication-NextAuth](./Authentication-NextAuth.md)           |
| سئو                 | [Metadata-And-SEO](./Metadata-And-SEO.md)                         |
| تصویر و فونت        | [Image-And-Font-Optimization](./Image-And-Font-Optimization.md)   |
| Supabase            | [Backend-Integration-Supabase](./Backend-Integration-Supabase.md) |

---

## ⚠️ اشتباهات رایج

❌ استفاده از Pages Router (`pages/`) در پروژهٔ جدید — App Router (`app/`) استاندارد فعلی است  
❌ گذاشتن `"use client"` در همهٔ فایل‌ها — پیش‌فرض Server Component است  
❌ `fetch` در Client Component به‌جای Server Component یا React Query  
❌ اشتباه گرفتن `next/router` (قدیمی) با `next/navigation` (App Router)  
❌ فراموش کردن `await params` در Next.js 15+

---

## ارتباط با مفاهیم دیگر

- [Server Components](../Escape-Hatches/Server-Components.md) — مفهوم RSC در React
- [Client Components](../Escape-Hatches/Client-Components.md)
- [Suspense](../Escape-Hatches/Suspense.md)
- [React Query](../State-Management/React-Query.md)
- [Performance — Best Practices](../Performance/Best-Practices.md)
- [React Router](../React-Router/README.md) — مسیریابی SPA (مقایسه)

---

## خلاصه

نسخه ۱۴+ Next.js با App Router = React + `routing` فایل‌محور + RSC + SSR/SSG/ISR + ابزارهای `production`.

---

## 📚 منابع

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Learn Next.js](https://nextjs.org/learn)
