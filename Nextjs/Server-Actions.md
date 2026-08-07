# Server Actions

> 🧭 پیش‌نیاز: [Client-Server Interleaving](./Client-Server-Interleaving.md) · بعدی: [Route Handlers](./Route-Handlers.md)

فرم‌ها و mutation سمت سرور با `'use server'` — بدون API route جدا.

---

## 📖 مفهوم

تابع‌های **Server Action** با directive `'use server'` مشخص می‌شوند و فقط روی سرور اجرا می‌شوند — از فرم HTML یا `formAction` در Client Component قابل فراخوانی‌اند. Next.js endpoint امن و progressive enhancement فراهم می‌کند.

---

## چرا این ویژگی وجود دارد؟

قبل از Server Actions، هر mutation نیاز به Route Handler (`POST /api/...`) + `fetch` از کلاینت داشت. Server Actions این لایه را ساده می‌کنند و با React 19 Forms یکپارچه‌اند.

---

## چه مشکلی را حل می‌کند؟

- CRUD بدون boilerplate API
- اعتبارسنجی و دسترسی روی سرور
- `revalidatePath`/`revalidateTag` پس از mutation
- UX با `useFormStatus`، `useOptimistic`، `useTransition`

---

## ⚙️ نحوه کار

```
فرم submit → Server Action (سرور) → DB/API → revalidate → UI به‌روز
```

دو محل تعریف:

1. **فایل جدا** با `'use server'` در بالای فایل
2. **داخل تابع** با `'use server'` inline (در Server Component)

---

## Syntax — فایل actions

```js
// app/_actions/reservations.js
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createReservation(formData) {
  const cabinId = formData.get("cabinId");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  const supabase = createClient();
  const { error } = await supabase.from("reservations").insert({
    cabinId,
    startDate,
    endDate,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/account/reservations");
  revalidatePath("/cabins");
}
```

---

## Syntax — فرم با action

```tsx
// app/cabins/[cabinId]/page.tsx — Server
import { createReservation } from "@/app/_actions/reservations";

export default async function CabinPage({ params }: { params: Promise<{ cabinId: string }> }) {
  const { cabinId } = await params;

  return (
    <form action={createReservation}>
      <input type="hidden" name="cabinId" value={cabinId} />
      <input type="date" name="startDate" required />
      <input type="date" name="endDate" required />
      <button type="submit">رزرو</button>
    </form>
  );
}
```

---

## Hooks مدرن (Client)

```tsx
"use client";

import { useFormStatus } from "react-dom";
import { useOptimistic, useTransition } from "react";
import { deleteReservation } from "@/app/_actions/reservations";

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteReservation(id))}
    >
      حذف
    </button>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "..." : "ارسال"}</button>;
}
```

مثال `useOptimistic`: [Examples/nextjs/OptimisticDelete.jsx](../Examples/nextjs/OptimisticDelete.jsx)

---

## 💡 مثال ساده

```tsx
// actions.ts
"use server";

export async function greet(formData: FormData) {
  const name = formData.get("name");
  console.log(`Hello, ${name}`);
}
```

```tsx
// page.tsx
import { greet } from "./actions";

export default function Page() {
  return (
    <form action={greet}>
      <input name="name" />
      <button type="submit">Send</button>
    </form>
  );
}
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis (طبق جزوه):

- ایجاد/ویرایش/حذف رزرو با Server Actions
- `useOptimistic` برای حذف فوری رزرو در UI
- `useFormStatus` برای دکمه loading
- `useTransition` برای navigation پس از submit
- `revalidatePath` پس از به‌روزرسانی پروفایل

---

## 🚀 Best Practices

✅ اعتبارسنجی و auth در خود action — هرگز به کلاینت اعتماد نکنید  
✅ `revalidatePath`/`revalidateTag` پس از تغییر داده  
✅ `useFormStatus` در component جدا زیر `<form>`  
✅ خطا را throw کنید — `error.tsx` یا `useActionState`  
✅ برای API عمومی/third-party از [Route Handlers](./Route-Handlers.md) استفاده کنید

---

## ⚠️ اشتباهات رایج

❌ فراخوانی Server Action از `useEffect` بدون user gesture در برخی سناریوها  
❌ فراموش کردن `revalidate` — UI قدیمی می‌ماند  
❌ قرار دادن secret در Client Component  
❌ `useFormStatus` در همان component که `<form>` دارد — باید child باشد  
❌ Server Action برای webhook خارجی — Route Handler مناسب‌تر است

---

## ارتباط با مفاهیم دیگر

- [Forms](../Forms.md) — Form Actions در React 19
- [useActionState](../Hooks/useActionState.md) · [useFormStatus](../Hooks/useFormStatus.md)
- [useOptimistic](../Hooks/useOptimistic.md) · [useTransition](../Hooks/useTransition.md)
- [Data-Fetching-And-Caching](./Data-Fetching-And-Caching.md)
- [Route-Handlers](./Route-Handlers.md)

---

## خلاصه

با `'use server'` و `form action` mutation امن روی سرور انجام می‌شود. با hooks مدرن تجربهٔ کاربری بهتر شود؛ پس از تغییر `revalidate` کنید.

---

## 📚 منابع

- [Server Actions — Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Form Actions — react.dev](https://react.dev/reference/react-dom/components/form)
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
