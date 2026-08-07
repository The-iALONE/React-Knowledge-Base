# Rendering Strategies

> 🧭 پیش‌نیاز: [Data Fetching & Caching](./Data-Fetching-And-Caching.md) · بعدی: [Streaming & Suspense](./Streaming-And-Suspense.md)

استراتژی‌های رندر در App Router: static، dynamic، SSR، SSG و ISR.

---

## 📖 مفهوم

در App Router، هر `route` می‌تواند به‌صورت **استاتیک** (در `build time` یا با `revalidate`) یا **پویا** (در هر `request`) رندر شود. انتخاب استراتژی روی SEO، سرعت و تازگی داده اثر مستقیم دارد.

اصطلاحات رایج: `SSG` (Static Site Generation)، `SSR` (Server-Side Rendering)، `ISR` (Incremental Static Regeneration).

---

## چرا این ویژگی وجود دارد؟

همهٔ صفحات به دادهٔ real-time نیاز ندارند. لیست کابین‌ها می‌تواند هر ساعت به‌روز شود؛ داشبورد کاربر باید هر بار تازه باشد. Next.js این trade-off را در سطح `route` قابل کنترل می‌کند.

---

## چه مشکلی را حل می‌کند؟

- تعادل بین سرعت (HTML از قبل ساخته) و تازگی داده
- SEO برای صفحات عمومی بدون JavaScript سنگین
- کاهش بار دیتابیس با `cache` و ISR
- کنترل صریح رفتار هر segment

---

## ⚙️ نحوه کار

| استراتژی | چه زمانی رندر | مثال Wild Oasis |
|----------|---------------|-----------------|
| **Static (SSG)** | `build time` یا با `revalidate` | صفحه `/about` |
| **Dynamic (SSR)** | هر `request` | `/account` با session |
| **ISR** | static + بازتولید دوره‌ای | لیست `/cabins` هر ۱ ساعت |
| **On-demand revalidation** | پس از mutation | پس از رزرو جدید |

### تشخیص static vs dynamic

یک `route` **پویا** می‌شود اگر از این‌ها استفاده کند:

- `cookies()`، `headers()`، `searchParams` (بدون `generateStaticParams`)
- `fetch` با `{ cache: 'no-store' }`
- `export const dynamic = 'force-dynamic'`

---

## Syntax — کنترل صریح

```tsx
// app/cabins/page.tsx — ISR: هر ۳۶۰۰ ثانیه
export const revalidate = 3600;

export default async function CabinsPage() {
  const cabins = await getCabins();
  return <CabinList cabins={cabins} />;
}
```

```tsx
// app/account/page.tsx — همیشه dynamic
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  // ...
}
```

```tsx
// app/cabins/[cabinId]/page.tsx — SSG برای مسیرهای شناخته‌شده
export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((c) => ({ cabinId: String(c.id) }));
}
```

---

## تفاوت با گزینه‌های مشابه

| | SSG | SSR | ISR |
|---|-----|-----|-----|
| زمان رندر | build | هر request | build + revalidate |
| تازگی | تا rebuild | همیشه تازه | تقریباً تازه |
| هزینه سرور | کم | بیشتر | متوسط |
| مناسب | about، blog | account، cart | لیست محصول |

---

## 💡 مثال ساده

```tsx
// fetch با ISR
const res = await fetch("https://api.example.com/cabins", {
  next: { revalidate: 60 },
});
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- `/cabins` — لیست با `revalidate` یا static + `revalidateTag` پس از رزرو
- `/cabins/[cabinId]` — `generateStaticParams` برای کابین‌های موجود + fallback dynamic
- `/account/*` — `force-dynamic` چون session کاربر لازم است
- `/about` — کاملاً static

---

## 🚀 Best Practices

✅ صفحات عمومی را static یا ISR نگه دارید  
✅ `generateStaticParams` برای مسیرهای dynamic با دادهٔ محدود  
✅ `dynamic = 'force-static'` فقط وقتی مطمئن هستید هیچ API dynamic ندارید  
✅ پس از mutation از `revalidatePath`/`revalidateTag` استفاده کنید  
✅ با `next build` خروجی static/dynamic هر route را بررسی کنید

---

## ⚠️ اشتباهات رایج

❌ ISR برای دادهٔ real-time (موجودی لحظه‌ای)  
❌ فراموش کردن `generateStaticParams` و انتظار SSG برای همهٔ `[id]`ها  
❌ `force-dynamic` روی کل اپ — فقط routeهای لازم  
❌ اشتباه گرفتن `revalidate` در `fetch` با `export const revalidate`  
❌ static کردن صفحه‌ای که `cookies()` می‌خواند — خطا یا رفتار غیرمنتظره

---

## ارتباط با مفاهیم دیگر

- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md) — `revalidate`، `tags`
- [Server-Components](./Server-Components.md) — محل `async` fetch
- [Server-Actions](./Server-Actions.md) — `revalidatePath` پس از mutation
- [Streaming-And-Suspense](./Streaming-And-Suspense.md) — partial prerender
- [Rendering](../Rendering.md) — مفاهیم React

---

## خلاصه

هر `route` استراتژی خودش را دارد: static برای سرعت، dynamic برای تازگی، ISR برای تعادل. با `revalidate`، `generateStaticParams` و `dynamic` کنترل کنید.

---

## 📚 منابع

- [Static and Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-and-dynamic-rendering)
- [Data Fetching — Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
