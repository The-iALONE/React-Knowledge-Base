# Backend Integration (Supabase)

> 🧭 پیش‌نیاز: [Image & Font Optimization](./Image-And-Font-Optimization.md) · بعدی: [Learning-Path — ضمیمه M11](../Learning-Path.md)

اتصال Next.js به Supabase — client/server، query و Row Level Security.

---

## 📖 مفهوم

سرویس backend-as-a-service به نام **Supabase** (PostgreSQL، Auth، Storage، Realtime) است. در App Router معمولاً دو client دارید: یکی برای Server Components/Actions و یکی برای Client Components — هر دو به همان پروژه Supabase متصل می‌شوند.

---

## چرا این ویژگی وجود دارد؟

ساخت API و دیتابیس از صفر برای پروژهٔ آموزشی یا MVP زمان‌بر است. Supabase schema، query و auth آماده فراهم می‌کند.

---

## چه مشکلی را حل می‌کند؟

- ذخیره کابین‌ها، رزروها، کاربران
- query از Server Component بدون API میانی
- Storage برای تصاویر کابین
- RLS برای امنیت سطح ردیف

---

## ⚙️ نحوه کار

```
Server Component/Action → @supabase/ssr (server client) → PostgreSQL
Client Component       → @supabase/supabase-js (browser client) → PostgreSQL (با RLS)
```

---

## Syntax — setup

```bash
npm install @supabase/supabase-js @supabase/ssr
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Server client

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
```

---

## Browser client

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

---

## Query در Server Component

```tsx
// app/cabins/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function CabinsPage() {
  const supabase = await createClient();
  const { data: cabins, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, image");

  if (error) throw new Error(error.message);

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

## Mutation با Server Action

```js
// app/_actions/reservations.js
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createReservation(formData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert({
    cabinId: formData.get("cabinId"),
    guestId: session.user.id,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (error) throw error;
  revalidatePath("/account/reservations");
}
```

---

## Row Level Security (RLS)

در Supabase Dashboard، RLS را برای جدول `reservations` فعال کنید — کاربر فقط رزروهای خودش را ببیند:

```sql
-- مثال ساده — در Supabase SQL Editor
CREATE POLICY "Users see own reservations"
ON reservations FOR SELECT
USING (auth.uid() = guest_id);
```

---

## 💡 مثال ساده

```tsx
const supabase = await createClient();
const { count } = await supabase.from("cabins").select("*", { count: "exact", head: true });
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- جداول `cabins`، `bookings`/`reservations`، `guests`
- لیست و جزئیات کابین از Server Component
- رزرو با Server Action + session کاربر
- تصاویر در Supabase Storage + `next/image` با `remotePatterns`
- setup اولیه در جزوه «راه‌اندازی supabase»

---

## 🚀 Best Practices

✅ Server client برای دادهٔ اولیه و mutations حساس  
✅ RLS را در Supabase فعال کنید — به anon key در client اعتماد نکنید  
✅ `revalidatePath` پس از insert/update/delete  
✅ `select` فقط ستون‌های لازم — نه `*` در production  
✅ service role key **فقط** در server env — هرگز `NEXT_PUBLIC_`

---

## ⚠️ اشتباهات رایج

❌ service role key در client bundle  
❌ RLS غیرفعال در production  
❌ یک client برای server و browser  
❌ فراموش کردن `await createClient()` در Next.js 15+  
❌ query سنگین بدون index در PostgreSQL

---

## ارتباط با مفاهیم دیگر

- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [Server-Actions](./Server-Actions.md)
- [Authentication-NextAuth](./Authentication-NextAuth.md)
- [React Query](../State-Management/React-Query.md) — جایگزین client-side cache
- [Image-And-Font-Optimization](./Image-And-Font-Optimization.md)

---

## خلاصه

با Supabase و `@supabase/ssr` داده را از Server و Client مدیریت کنید — دو client جدا؛ RLS اجباری؛ mutations در Server Action با `auth()` و `revalidate`.

---

## 📚 منابع

- [Supabase — Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Server-Side Auth — Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
