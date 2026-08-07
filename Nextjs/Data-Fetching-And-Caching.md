# Data Fetching and Caching

> 🧭 پیش‌نیاز: [Loading & Error States](./Loading-And-Error-States.md) · بعدی: [Rendering Strategies](./Rendering-Strategies.md)

دریافت داده در Server Components، `cache` پیش‌فرض Next.js و `revalidate`.

---

## 📖 مفهوم

در Server Components، `fetch` به‌صورت `async` انجام می‌شود. Next.js روی `fetch` یک لایه `cache` اضافه می‌کند (Data Cache) با گزینه‌های `revalidate` و `tags`.

---

## چرا این ویژگی وجود دارد؟

کاهش درخواست تکراری به API/DB؛ بهبود `performance` و هزینه سرور.

---

## چه مشکلی را حل می‌کند؟

- داده تازه vs static
- invalidate پس از mutation
- deduplication درخواست‌های هم‌زمان

---

## ⚙️ نحوه کار

```
fetch(url) → Data Cache → (optional) revalidate on interval or on-demand
```

`unstable_noStore()` یا `cache: 'no-store'` `cache` را غیرفعال می‌کند.

---

## چه زمانی استفاده کنیم؟

لیست کابین‌ها، پروفایل کاربر، هر داده خواندنی در RSC.

---

## چه زمانی استفاده نکنیم؟

داده real-time حساس — `no-store` یا client polling/WebSocket.

---

## Syntax — fetch در Server Component

```tsx
// app/cabins/page.tsx
async function getCabins() {
  const res = await fetch("https://api.example.com/cabins", {
    next: { revalidate: 3600 }, // ISR: هر ۱ ساعت
  });

  if (!res.ok) throw new Error("Failed to fetch cabins");
  return res.json();
}

export default async function CabinsPage() {
  const cabins = await getCabins();
  return <CabinList cabins={cabins} />;
}
```

---

## گزینه‌های cache

| روش                              | رفتار                             |
| -------------------------------- | --------------------------------- |
| پیش‌فرض                          | `cache` می‌شود (static)           |
| `{ cache: 'no-store' }`          | همیشه fresh (SSR)                 |
| `{ next: { revalidate: 60 } }`   | ISR — هر ۶۰ ثانیه                 |
| `{ next: { tags: ['cabins'] } }` | `tag` برای on-demand revalidation |

---

## revalidatePath / revalidateTag

```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createReservation() {
  // ... insert to DB
  revalidatePath("/account/reservations");
  revalidateTag("cabins");
}
```

---

## مستقیم از DB (بدون fetch)

```tsx
import { createClient } from "@/lib/supabase/server";

export async function getCabins() {
  const supabase = createClient();
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) throw error;
  return data;
}
```

برای کنترل `cache` از `unstable_cache` یا `fetch` wrapper استفاده کنید.

---

## unstable_cache

```tsx
import { unstable_cache } from "next/cache";

const getCabins = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase.from("cabins").select("*");
    return data;
  },
  ["cabins-list"],
  { revalidate: 3600, tags: ["cabins"] },
);
```

---

## 💡 مثال ساده

```tsx
export default async function Page() {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: { revalidate: 10 },
  }).then((r) => r.json());

  return (
    <ul>
      {data.map((p: { id: number; title: string }) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:

- لیست کابین‌ها با `revalidate` یا static + `revalidateTag` پس از رزرو
- صفحه account با `no-store` (داده کاربر خصوصی)
- `revalidatePath('/cabins')` در Server Action پس از ویرایش

---

## 🚀 Best Practices

✅ داده را در همان componentی که نیاز دارد `fetch` کنید  
✅ داده خصوصی کاربر: `no-store` یا `cookies()` → dynamic  
✅ `tag` برای گروه‌های مرتبط داده  
✅ خطا را throw کنید تا `error.tsx` فعال شود

---

## ⚠️ اشتباهات رایج

❌ `fetch` در Client Component برای دادهٔ اولیه — در RSC انجام دهید  
❌ فراموش کردن `revalidatePath`/`revalidateTag` پس از mutation  
❌ `cache` کردن دادهٔ خصوصی کاربر — `no-store` یا dynamic route  
❌ اتکا به پیش‌فرض `cache` برای دادهٔ real-time  
❌ duplicate `fetch` بدون `tag` — از `unstable_cache` با key مشترک استفاده کنید

---

## ارتباط با مفاهیم دیگر

- [Rendering-Strategies](./Rendering-Strategies.md)
- [Server-Components](./Server-Components.md)
- [Server-Actions](./Server-Actions.md)
- [Backend-Integration-Supabase](./Backend-Integration-Supabase.md)
- [React Query](../State-Management/React-Query.md)

---

## خلاصه

در RSC از `fetch` `async` با `revalidate` / `tags` / `no-store` برای کنترل `cache` در Next.js استفاده کنید.

---

## 📚 منابع

- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching](https://nextjs.org/docs/app/building-your-application/caching)
