# Loading and Error States

> 🧭 پیش‌نیاز: [Navigation](./Navigation.md) · بعدی: [Data Fetching & Caching](./Data-Fetching-And-Caching.md)

مدیریت loading و error با `loading.tsx`، `error.tsx` و error boundaries در App Router.

---

## 📖 مفهوم

در Next.js برای هر segment از `route` می‌توان UI مخصوص **در حال بارگذاری** و **خطا** تعریف کرد. این فایل‌ها به‌صورت خودکار با React Suspense و Error Boundaries یکپارچه می‌شوند.

---

## چرا این ویژگی وجود دارد؟

برای تجربهٔ کاربری بهتر هنگام Server Components `async` و `fetch`؛ جلوگیری از صفحه سفید یا crash کل اپ.

---

## چه مشکلی را حل می‌کند؟

- نمایش skeleton/spinner هنگام `await`
- catch خطا در یک segment بدون از بین رفتن `layout` والد
- دکمه retry برای کاربر

---

## ⚙️ نحوه کار

- `loading.tsx` → Suspense boundary برای `page` و children آن segment
- `error.tsx` → Client Component که خطاهای child را می‌گیرد
- `not-found.tsx` → برای `notFound()` از `next/navigation`

---

## چه زمانی استفاده کنیم؟

هر `route` با `fetch` `async` یا احتمال خطای شبکه/دیتابیس.

---

## چه زمانی استفاده نکنیم؟

وقتی `fetch` `async` طولانی است — نه برای عملیات زیر ۲۰۰ms که فقط flash ایجاد می‌کند.

---

## Syntax — loading.tsx

```tsx
// app/cabins/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse bg-gray-200 rounded" />
      ))}
    </div>
  );
}
```

---

## Syntax — error.tsx

```tsx
"use client"; // اجباری

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## notFound

```tsx
// app/cabins/[cabinId]/page.tsx
import { notFound } from "next/navigation";
import { getCabin } from "@/lib/data";

export default async function CabinPage({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);

  if (!cabin) notFound();

  return <CabinDetails cabin={cabin} />;
}
```

```tsx
// app/cabins/[cabinId]/not-found.tsx
export default function NotFound() {
  return <h2>Cabin not found</h2>;
}
```

---

## global-error.tsx

```tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

---

## 💡 مثال ساده

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:

- `app/cabins/loading.tsx` — skeleton کارت کابین
- `app/cabins/[cabinId]/error.tsx` — خطای Supabase
- `notFound()` وقتی `cabinId` نامعتبر است

---

## 🚀 Best Practices

✅ skeleton شبیه `layout` نهایی (کاهش CLS)  
✅ پیام خطا کاربرپسند؛ جزئیات در log سرور  
✅ `reset()` برای re-render segment  
✅ بارگذاری در سطح component با `<Suspense>` برای کنترل دقیق‌تر

---

## ⚠️ اشتباهات رایج

❌ فراموش کردن `"use client"` در `error.tsx` — اجباری است  
❌ throw کردن خطا در Client Component بدون `error.tsx` والد  
❌ استفاده از `notFound()` بدون `not-found.tsx` سفارشی  
❌ نمایش stack trace به کاربر در production  
❌ `global-error.tsx` بدون `<html>` و `<body>` — layout ریشه را جایگزین می‌کند

---

## ارتباط با مفاهیم دیگر

- [Streaming-And-Suspense](./Streaming-And-Suspense.md)
- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [Suspense](../Escape-Hatches/Suspense.md)
- [Error Boundaries](../Error-Boundaries.md)

---

## خلاصه

فایل `loading.tsx` یعنی UI بارگذاری Suspense؛ `error.tsx` مرز خطای Client با `reset`؛ `notFound()` برای 404.

---

## 📚 منابع

- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
