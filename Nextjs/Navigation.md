# Navigation

> 🧭 پیش‌نیاز: [Layouts](./Layouts.md) · بعدی: [Loading & Error States](./Loading-And-Error-States.md)

ناوبری در App Router: `Link`، `useRouter`، `redirect` و `prefetch`.

---

## 📖 مفهوم

در Next.js، لینک‌های `client-side` با `prefetch` هوشمند و APIهای `imperative` برای `redirect` و back/forward فراهم می‌کند.

---

## چرا این ویژگی وجود دارد؟

ناوبری `SPA-like` بدون reload کامل صفحه؛ حفظ `state` در `layout`ها.

---

## چه مشکلی را حل می‌کند؟

- جایگزین `<a href>` برای `route`های داخلی
- `redirect` سمت سرور پس از action
- programmatic navigation در Client Components

---

## ⚙️ نحوه کار

`<Link>` RSC payload و JS لازم را `prefetch` می‌کند (در viewport). `useRouter` از `next/navigation` (نه `next/router` قدیمی).

---

## چه زمانی استفاده کنیم؟

هر لینک داخلی، `redirect` پس از login، دکمه «بازگشت».

---

## چه زمانی استفاده نکنیم؟

لینک خارجی — `<a target="_blank" rel="noopener">` معمولی.

---

## Syntax — Link

```tsx
import Link from "next/link";

export function CabinCard({ id, name }: { id: number; name: string }) {
  return (
    <Link href={`/cabins/${id}`} className="card">
      {name}
    </Link>
  );
}
```

### Active link

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? "font-bold" : ""}>
      {children}
    </Link>
  );
}
```

---

## redirect (Server)

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>Account</div>;
}
```

---

## useRouter (Client)

```tsx
"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh(); // revalidate Server Components
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## searchParams در Link

```tsx
<Link href={{ pathname: "/cabins", query: { sort: "price" } }}>
  Sort by price
</Link>
// یا
<Link href="/cabins?sort=price">Sort by price</Link>
```

---

## 💡 مثال ساده

```tsx
<nav>
  <Link href="/">Home</Link>
  <Link href="/cabins">Cabins</Link>
  <Link href="/account">Account</Link>
</nav>
```

---

## مثال واقعی در پروژه

در پروژهٔ Wild Oasis:
- کارت کابین → `/cabins/[cabinId]`
- پس از login موفق → `redirect("/account")`
- `router.refresh()` پس از رزرو برای به‌روز لیست

---

## 🚀 Best Practices

✅ `next/link` برای `route`های داخلی  
✅ `prefetch={false}` روی لیست‌های خیلی بزرگ اگر لازم شد  
✅ `router.refresh()` بعد از mutation سمت سرور  
✅ `usePathname` / `useSearchParams` فقط در Client Components  

---

## ⚠️ اشتباهات رایج

❌ استفاده از `<a href="/internal">` به‌جای `<Link>` — reload کامل صفحه  
❌ import از `next/router` در App Router — باید `next/navigation` باشد  
❌ فراموش کردن `router.refresh()` پس از mutation سمت سرور  
❌ `redirect()` بعد از `return` یا داخل try/catch بدون re-throw  
❌ `useSearchParams` در Server Component — از `searchParams` prop استفاده کنید

---

## ارتباط با مفاهیم دیگر

- [Routing-And-Pages](./Routing-And-Pages.md)
- [Layouts](./Layouts.md)
- [Server-Actions](./Server-Actions.md)
- [Middleware](./Middleware.md)
- [React Router — Navigation](../React-Router/Navigation.md)

---

## خلاصه

برای ناوبری declarative از `Link`؛ در Server از `redirect`؛ برای imperative و `refresh` از `useRouter`.

---

## 📚 منابع

- [Linking and Navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)
