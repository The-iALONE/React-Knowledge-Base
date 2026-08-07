# Server Components in Next.js

> 🧭 پیش‌نیاز: [Streaming & Suspense](./Streaming-And-Suspense.md) · بعدی: [Client-Server Interleaving](./Client-Server-Interleaving.md)

پیاده‌سازی React Server Components در App Router — `async` component، `fetch`، و محدودیت‌ها.

---

## 📖 مفهوم

در App Router، **پیش‌فرض** هر کامپوننت در `app/` یک Server Component است — روی سرور اجرا می‌شود، می‌تواند `async` باشد و مستقیماً به دیتابیس/API دسترسی دارد. JavaScript آن به bundle کلاینت ارسال نمی‌شود.

مفهوم پایهٔ RSC در React: [Escape-Hatches/Server-Components.md](../Escape-Hatches/Server-Components.md). این فایل زاویهٔ **پیاده‌سازی Next.js** را پوشش می‌دهد.

---

## چرا این ویژگی وجود دارد؟

داده و منطق سمت سرور نزدیک هم می‌مانند؛ bundle کلاینت کوچک‌تر می‌شود و secretها (API key، connection string) هرگز به مرورگر نمی‌رسند.

---

## چه مشکلی را حل می‌کند؟

- `fetch` مستقیم در component بدون `useEffect`
- دسترسی امن به DB و env variables
- کاهش JavaScript ارسالی به مرورگر
- SEO با HTML کامل از سرور

---

## ⚙️ نحوه کار

```
app/page.tsx (Server) → render روی سرور → HTML + RSC Payload → مرورگر
                     → Client Components جدا hydrate می‌شوند
```

### قوانین Server Component

| مجاز | ممنوع |
|------|-------|
| `async`/`await` | `useState`، `useEffect` |
| `fetch`، DB query | event handler (`onClick`) |
| `cookies()`، `headers()` | `window`، `localStorage` |
| import Server-only modules | import Client-only libs بدون `"use client"` |

---

## Syntax — async Server Component

```tsx
// app/cabins/page.tsx — Server Component (پیش‌فرض)
import { createClient } from "@/lib/supabase/server";

export default async function CabinsPage() {
  const supabase = createClient();
  const { data: cabins } = await supabase.from("cabins").select("*");

  return (
    <ul>
      {cabins?.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
```

---

## React.cache و deduplication

```tsx
import { cache } from "react";

export const getCabin = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/cabins/${id}`);
  return res.json();
});
```

در یک `request`، چند component می‌توانند `getCabin(id)` را صدا بزنند — فقط یک بار اجرا می‌شود.

---

## cacheSignal (React 19.2)

وقتی `fetch` با `cache` لغو می‌شود (مثلاً timeout یا abort)، `cacheSignal` از `react` به شما اطلاع می‌دهد:

```tsx
import { cacheSignal } from "react";

async function getData() {
  const signal = cacheSignal();
  if (signal?.aborted) return null;
  // ...
}
```

---

## prerender / resume (react-dom/static)

برای کنترل پیشرفته streaming و static shell در React 19+:

- `prerender` — ساخت shell استاتیک
- `resume` — ادامهٔ render پس از دادهٔ async

جزئیات: [react.dev — react-dom/static](https://react.dev/reference/react-dom/static). در Next.js معمولاً `loading.tsx` و PPR این کار را ساده‌تر می‌کنند — [Streaming-And-Suspense](./Streaming-And-Suspense.md).

---

## 💡 مثال ساده

```tsx
// Server Component — بدون "use client"
export default async function Page() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (r) => r.json(),
  );
  return <h1>{posts.length} posts</h1>;
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:

- `app/cabins/page.tsx` — لیست کابین با Supabase server client
- `app/cabins/[cabinId]/page.tsx` — جزئیات + `notFound()` اگر کابین نباشد
- `layout` ریشه — metadata و فونت (server) + Client wrapper برای session

---

## 🚀 Best Practices

✅ پیش‌فرض server بماند؛ `"use client"` فقط برای interactivity  
✅ داده را نزدیک مصرف `fetch` کنید — [State Colocation](../Performance/State-Colocation.md)  
✅ از `cache()` برای deduplication در یک request  
✅ secret فقط در Server Component یا Server Action  
✅ Client child را برای بخش interactive جدا import کنید

---

## ⚠️ اشتباهات رایج

❌ `"use client"` روی کل `page` فقط برای یک دکمه  
❌ `useEffect` + `fetch` در Client وقتی RSC کافی است  
❌ پاس دادن function از Server به Client Component  
❌ import کردن server-only code در Client Component  
❌ فراموش کردن `await` برای `params` در Next.js 15+

---

## ارتباط با مفاهیم دیگر

- [Server Components (React)](../Escape-Hatches/Server-Components.md) — مفهوم RSC، Flight
- [Client Components](../Escape-Hatches/Client-Components.md)
- [Client-Server-Interleaving](./Client-Server-Interleaving.md)
- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [Server-Actions](./Server-Actions.md)

---

## خلاصه

در App Router پیش‌فرض Server Component است — `async`، `fetch`، DB. برای hook و event به Client Component با `"use client"` بروید. مفهوم React در M5؛ پیاده‌سازی اینجا.

---

## 📚 منابع

- [Server Components — Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Components — react.dev](https://react.dev/reference/rsc/server-components)
- [cache — react.dev](https://react.dev/reference/react/cache)
- [cacheSignal — react.dev](https://react.dev/reference/react/cacheSignal)
