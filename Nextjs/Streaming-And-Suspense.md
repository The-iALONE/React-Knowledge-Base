# Streaming and Suspense

> 🧭 پیش‌نیاز: [Rendering Strategies](./Rendering-Strategies.md) · بعدی: [Server Components](./Server-Components.md)

استریمینگ HTML و RSC payload با `loading.tsx`، `<Suspense>` و partial prerender.

---

## 📖 مفهوم

در App Router، پاسخ سرور می‌تواند به‌صورت **تدریجی** (streaming) ارسال شود — بخش‌های آماده HTML زودتر به مرورگر می‌رسند و بخش‌های `async` بعداً با `<Suspense>` پر می‌شوند. فایل `loading.tsx` یک Suspense boundary خودکار برای segment ایجاد می‌کند.

---

## چرا این ویژگی وجود دارد؟

وقتی یک `fetch` کند کل صفحه را block کند، کاربر صفحه سفید می‌بیند. استریمینگ اجازه می‌دهد header و shell زودتر نمایش داده شود و skeleton برای بخش‌های در حال بارگذاری بیاید.

---

## چه مشکلی را حل می‌کند؟

- کاهش Time to First Byte (TTFB) perceived
- جداسازی بخش‌های کند و سریع صفحه
- یکپارچگی با `loading.tsx` بدون boilerplate دستی
- partial prerender (PPR) در نسخه‌های جدید

---

## ⚙️ نحوه کار

```
Request → Shell (layout) فوراً stream می‌شود
       → Suspense boundary → fallback (loading.tsx)
       → async component آماده → جایگزین fallback
```

سه سطح Suspense:

1. **Route level** — `loading.tsx` در segment
2. **Component level** — `<Suspense fallback={...}>` دستی
3. **Nested** — چند boundary تو در تو

---

## Syntax — loading.tsx (خودکار)

```tsx
// app/cabins/loading.tsx
export default function Loading() {
  return <CabinListSkeleton />;
}
```

---

## Syntax — Suspense دستی

```tsx
// app/cabins/page.tsx
import { Suspense } from "react";
import CabinList from "./CabinList";
import ReservationStats from "./ReservationStats";

export default function CabinsPage() {
  return (
    <div>
      <h1>Cabins</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <ReservationStats />
      </Suspense>
      <Suspense fallback={<ListSkeleton />}>
        <CabinList />
      </Suspense>
    </div>
  );
}
```

---

## Partial Prerender (PPR)

در نسخه‌های جدید Next.js، بخش static صفحه در build ساخته می‌شود و بخش dynamic در runtime stream می‌شود. در `next.config.ts`:

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    ppr: true,
  },
};
```

APIهای `react-dom/static` مثل `prerender` و `resume` برای کنترل پیشرفته‌تر streaming در React 19+ — جزئیات در [Server-Components](./Server-Components.md).

---

## 💡 مثال ساده

```tsx
import { Suspense } from "react";

async function SlowData() {
  const data = await fetch("https://slow.api/data").then((r) => r.json());
  return <pre>{JSON.stringify(data)}</pre>;
}

export default function Page() {
  return (
    <Suspense fallback={<p>در حال بارگذاری...</p>}>
      <SlowData />
    </Suspense>
  );
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- `app/cabins/loading.tsx` — skeleton کارت کابین هنگام `fetch` لیست
- استریمینگ segment با `loading.js` برای `/cabins/[cabinId]`
- Suspense دور بخش آمار رزرو (کند) جدا از لیست کابین (سریع‌تر)

---

## 🚀 Best Practices

✅ boundary را نزدیک component کند قرار دهید — نه یک Suspense برای کل صفحه  
✅ skeleton شبیه layout نهایی (کاهش CLS)  
✅ از `loading.tsx` برای UX ساده segment استفاده کنید  
✅ دادهٔ مستقل را در Suspense جدا `fetch` کنید (waterfall نسازید)  
✅ با React DevTools یا Network tab استریم را تأیید کنید

---

## ⚠️ اشتباهات رایج

❌ یک Suspense بزرگ برای همهٔ `await`ها — waterfall داخلی  
❌ fallback خالی — کاربر نمی‌فهمد چیزی در حال load است  
❌ قرار دادن `"use client"` روی component که فقط برای Suspense لازم نیست  
❌ انتظار streaming در Client Component — فقط Server + Suspense  
❌ فراموش کردن `key` در لیست داخل Suspense — [Keys](../Performance/Keys-And-Performance.md)

---

## ارتباط با مفاهیم دیگر

- [Loading-And-Error-States](./Loading-And-Error-States.md) — `loading.tsx`، `error.tsx`
- [Suspense](../Escape-Hatches/Suspense.md) — مفهوم React
- [Server-Components](./Server-Components.md) — `async` و `cacheSignal`
- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [Rendering-Strategies](./Rendering-Strategies.md)

---

## خلاصه

استریمینگ یعنی ارسال تدریجی HTML — `loading.tsx` و `<Suspense>` boundary تعریف می‌کنند. برای تجربهٔ کاربری بهتر، بخش‌های کند را جدا کنید.

---

## 📚 منابع

- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Suspense — react.dev](https://react.dev/reference/react/Suspense)
- [Partial Prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
